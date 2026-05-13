import asyncio
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import settings
from app.core.ingestion.loader import ingest_file, ingest_url
from app.db.client import get_supabase


router = APIRouter()


@router.post("/upload")
async def upload_document(
    project_id: str = Form(...),
    file: UploadFile = File(...),
):
    if file.size and file.size > settings.max_file_size_mb * 1024 * 1024:
        raise HTTPException(
            400, f"File too large. Max: {settings.max_file_size_mb}MB"
        )
    file_bytes = await file.read()
    doc_id = str(uuid.uuid4())
    asyncio.create_task(
        ingest_file(file_bytes, file.filename, file.content_type or "", project_id, doc_id)
    )
    return {"document_id": doc_id, "status": "processing"}


@router.post("/ingest-url")
async def ingest_url_endpoint(body: dict):
    url = body.get("url", "").strip()
    project_id = body.get("project_id", "").strip()
    if not url or not project_id:
        raise HTTPException(400, "url and project_id required")
    doc_id = str(uuid.uuid4())
    asyncio.create_task(ingest_url(url, project_id, doc_id))
    return {"document_id": doc_id, "status": "processing"}


@router.get("/{project_id}")
async def list_documents(project_id: str):
    supabase = get_supabase()
    result = (
        supabase.table("documents")
        .select("*")
        .eq("project_id", project_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    supabase = get_supabase()
    supabase.table("chunks").delete().eq("document_id", document_id).execute()
    supabase.table("documents").delete().eq("id", document_id).execute()
    return {"deleted": True}

