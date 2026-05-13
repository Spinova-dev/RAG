from openai import AsyncOpenAI

from app.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)


async def embed_texts(texts: list[str]) -> list[list[float]]:
    all_embeddings: list[list[float]] = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = await client.embeddings.create(
            model=settings.embedding_model,
            input=batch,
            dimensions=settings.embedding_dim,
        )
        all_embeddings.extend([e.embedding for e in response.data])
    return all_embeddings


async def embed_query(text: str) -> list[float]:
    response = await client.embeddings.create(
        model=settings.embedding_model,
        input=[text],
        dimensions=settings.embedding_dim,
    )
    return response.data[0].embedding

