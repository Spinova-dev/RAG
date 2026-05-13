from openai import AsyncOpenAI

from app.config import settings
from app.db.client import get_supabase


def get_openai_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.openai_api_key)


def get_db():
    return get_supabase()

