from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core.generation.chain import rag_stream


router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    project_id: str
    conversation_id: str | None = None
    history: list[dict] = []


@router.post("/stream")
async def stream_chat(req: ChatRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty")
    return StreamingResponse(
        rag_stream(req.question, req.project_id, req.history),
        media_type="text/event-stream",
        headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"},
    )

