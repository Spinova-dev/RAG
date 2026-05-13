from openai import AsyncOpenAI

from app.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

EXPAND_PROMPT = """Generate 3 different search queries for the same question.
Return ONLY the queries, one per line, no numbering.
Question: {question}"""


async def expand_query(question: str) -> list[str]:
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": EXPAND_PROMPT.format(question=question)}],
        temperature=0.7,
        max_tokens=200,
    )
    content = response.choices[0].message.content or ""
    variants = content.strip().split("\n")
    extra = [v.strip() for v in variants if v.strip()]
    return [question] + extra[:3]

