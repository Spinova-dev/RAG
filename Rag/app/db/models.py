from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass
class Project:
    id: str
    user_id: str | None
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime


@dataclass
class Document:
    id: str
    project_id: str
    user_id: str | None
    filename: str
    source_url: str | None
    file_type: str
    file_size: int | None
    chunk_count: int
    status: str
    error_msg: str | None
    storage_path: str | None
    created_at: datetime


@dataclass
class Chunk:
    id: str
    document_id: str
    project_id: str
    content: str
    embedding: list[float]
    chunk_index: int
    page_number: int | None
    metadata: dict[str, Any]
    created_at: datetime

