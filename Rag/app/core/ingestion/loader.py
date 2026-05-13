import uuid
from typing import Literal

from app.core.ingestion.chunker import chunk_document
from app.core.ingestion.embedder import embed_texts
from app.core.ingestion.parsers import ParsedDocument, dispatch_parser, parse_url
from app.db.client import get_supabase


async def _store_document_record(
    project_id: str,
    document_id: str,
    filename: str,
    file_type: str,
    file_size: int | None,
    source_url: str | None = None,
) -> None:
    supabase = get_supabase()
    supabase.table("documents").insert(
        {
            "id": document_id,
            "project_id": project_id,
            "filename": filename,
            "file_type": file_type,
            "file_size": file_size,
            "status": "processing",
            "source_url": source_url,
        }
    ).execute()


async def _finalize_document_status(
    document_id: str,
    status: Literal["ready", "error"],
    chunk_count: int = 0,
    error_msg: str | None = None,
) -> None:
    supabase = get_supabase()
    update: dict = {"status": status, "chunk_count": chunk_count}
    if error_msg:
        update["error_msg"] = error_msg
    supabase.table("documents").update(update).eq("id", document_id).execute()


async def _store_chunks(
    project_id: str,
    document_id: str,
    parsed: ParsedDocument,
) -> int:
    supabase = get_supabase()
    chunks = chunk_document(parsed, document_id)
    texts = [c.content for c in chunks]
    embeddings = await embed_texts(texts)
    rows: list[dict] = []
    for chunk, embedding in zip(chunks, embeddings):
        rows.append(
            {
                "id": str(uuid.uuid4()),
                "document_id": document_id,
                "project_id": project_id,
                "content": chunk.content,
                "embedding": embedding,
                "chunk_index": chunk.chunk_index,
                "page_number": chunk.page_number,
                "metadata": chunk.metadata,
            }
        )
    if rows:
        supabase.table("chunks").insert(rows).execute()
    return len(rows)


async def ingest_file(
    file_bytes: bytes,
    filename: str,
    mime: str,
    project_id: str,
    document_id: str,
) -> None:
    await _store_document_record(
        project_id=project_id,
        document_id=document_id,
        filename=filename,
        file_type=mime or "",
        file_size=len(file_bytes),
    )
    try:
        parsed = dispatch_parser(file_bytes, filename, mime or "")
        count = await _store_chunks(project_id, document_id, parsed)
        await _finalize_document_status(document_id, "ready", chunk_count=count)
    except Exception as exc:
        await _finalize_document_status(document_id, "error", error_msg=str(exc))


async def ingest_url(url: str, project_id: str, document_id: str) -> None:
    await _store_document_record(
        project_id=project_id,
        document_id=document_id,
        filename=url,
        file_type="url",
        file_size=None,
        source_url=url,
    )
    try:
        parsed = await parse_url(url)
        count = await _store_chunks(project_id, document_id, parsed)
        await _finalize_document_status(document_id, "ready", chunk_count=count)
    except Exception as exc:
        await _finalize_document_status(document_id, "error", error_msg=str(exc))

