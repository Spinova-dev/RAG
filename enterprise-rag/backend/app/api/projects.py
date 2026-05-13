import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db.client import get_supabase


router = APIRouter()


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


@router.get("/")
async def list_projects():
    supabase = get_supabase()
    result = (
        supabase.table("projects")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.post("/")
async def create_project(body: ProjectCreate):
    supabase = get_supabase()
    project_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    record = {
        "id": project_id,
        "name": body.name,
        "description": body.description,
        "created_at": now,
        "updated_at": now,
    }
    result = supabase.table("projects").insert(record).execute()
    if not result.data:
        raise HTTPException(500, "Failed to create project")
    return result.data[0]


@router.get("/{project_id}")
async def get_project(project_id: str):
    supabase = get_supabase()
    result = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(404, "Project not found")
    return result.data[0]


@router.put("/{project_id}")
async def update_project(project_id: str, body: ProjectUpdate):
    supabase = get_supabase()
    update = body.model_dump(exclude_unset=True)
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = (
        supabase.table("projects")
        .update(update)
        .eq("id", project_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Project not found")
    return result.data[0]


@router.delete("/{project_id}")
async def delete_project(project_id: str):
    supabase = get_supabase()
    supabase.table("projects").delete().eq("id", project_id).execute()
    return {"deleted": True}

