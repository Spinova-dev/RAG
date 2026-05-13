import asyncio
import json
from typing import AsyncGenerator

from openai import AsyncOpenAI

from app.config import settings
from app.core.generation.prompts import SYSTEM_PROMPT, build_context, build_history
from app.core.retrieval.retriever import retrieve_chunks
from app.core.retrieval.query_expander import expand_query
from app.utils.cost_tracker import estimate_cost

client = AsyncOpenAI(api_key=settings.openai_api_key)


async def rag_stream(
    question: str,
    project_id: str,
    history: list[dict],
) -> AsyncGenerator[str, None]:
    queries = await expand_query(question)
    seen_ids: set[str] = set()
    all_chunks = []
    tasks = [retrieve_chunks(q, project_id) for q in queries]
    results = await asyncio.gather(*tasks)
    for chunk_list in results:
        for chunk in chunk_list:
            if chunk.id not in seen_ids:
                seen_ids.add(chunk.id)
                all_chunks.append(chunk)
    all_chunks.sort(key=lambda x: x.similarity, reverse=True)
    top_chunks = all_chunks[: settings.top_k_rerank]
    context = build_context(top_chunks)
    hist_str = build_history(history)
    system_msg = SYSTEM_PROMPT.format(context=context, history=hist_str)
    total_tokens = 0
    stream = await client.chat.completions.create(
        model=settings.chat_model,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": question},
        ],
        max_tokens=settings.max_tokens,
        temperature=0.1,
        stream=True,
        stream_options={"include_usage": True},
    )
    async for event in stream:
        if event.choices and event.choices[0].delta.content:
            token = event.choices[0].delta.content
            yield f"data: {json.dumps({'type': 'chunk', 'content': token})}\n\n"
        if event.usage:
            total_tokens = event.usage.total_tokens
    sources = [
        {
            "id": c.id,
            "document_id": c.document_id,
            "content": c.content[:300],
            "page": c.page_number,
            "similarity": round(c.similarity, 3),
        }
        for c in top_chunks
    ]
    yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"
    cost = estimate_cost(total_tokens, settings.chat_model)
    yield f"data: {json.dumps({'type': 'cost', 'tokens': total_tokens, 'cost_usd': cost})}\n\n"
    yield f"data: {json.dumps({'type': 'done'})}\n\n"
