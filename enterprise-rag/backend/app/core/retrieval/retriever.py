from dataclasses import dataclass

from app.config import settings
from app.core.ingestion.embedder import embed_query
from app.db.client import get_supabase


@dataclass
class RetrievedChunk:
    id: str
    document_id: str
    content: str
    page_number: int
    similarity: float
    metadata: dict


async def retrieve_chunks(
    query: str,
    project_id: str,
    top_k: int | None = None,
) -> list[RetrievedChunk]:
    top_k = top_k or settings.top_k_retrieval
    query_embedding = await embed_query(query)
    supabase = get_supabase()
    result = supabase.rpc(
        "match_chunks",
        {
            "query_embedding": query_embedding,
            "match_project_id": project_id,
            "match_count": top_k,
        },
    ).execute()
    chunks: list[RetrievedChunk] = []
    for row in result.data or []:
        if row["similarity"] >= settings.min_similarity:
            chunks.append(RetrievedChunk(**row))
    return chunks

