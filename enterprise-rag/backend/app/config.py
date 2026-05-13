from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "Enterprise RAG Platform"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000"]

    openai_api_key: str
    embedding_model: str = "text-embedding-3-small"
    embedding_dim: int = 1536
    chat_model: str = "gpt-4o-mini"
    chat_model_smart: str = "gpt-4o"
    max_tokens: int = 2048

    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    chunk_size: int = 800
    chunk_overlap: int = 150
    top_k_retrieval: int = 8
    top_k_rerank: int = 4
    min_similarity: float = 0.35

    max_file_size_mb: int = 50
    max_files_per_project: int = 100

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

