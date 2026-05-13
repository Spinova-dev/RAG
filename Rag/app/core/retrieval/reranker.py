from dataclasses import dataclass
from typing import Sequence


@dataclass
class RerankInput:
    id: str
    content: str
    score: float


async def rerank(chunks: Sequence[RerankInput], top_k: int) -> list[RerankInput]:
    sorted_chunks = sorted(chunks, key=lambda c: c.score, reverse=True)
    return list(sorted_chunks[:top_k])

