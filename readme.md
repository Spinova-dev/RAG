
CURSOR BUILD SPEC
Enterprise RAG Platform
From Zero to Production


Complete specification for Cursor AI — every file, every line, every decision
Stack	Deploy	Cost	Build Time
Next.js + FastAPI	Vercel + Render	$0 except OpenAI	4–6 Weeks

Version 1.0  ·  2026  ·  Confidential Build Document
 
1. Project Overview & Goals
1.1 What We Are Building
A full-stack, production-ready Retrieval-Augmented Generation (RAG) platform that allows users to upload documents (PDF, DOCX, TXT, CSV, web URLs) and have intelligent conversations with their content. The system uses OpenAI embeddings + GPT-4o, stores vectors in Supabase pgvector, streams responses in real-time, and exposes a beautiful Next.js chat interface. Total infrastructure cost: $0 (free tiers only) beyond the OpenAI API calls.

1.2 Core Principles for Cursor
•	ZERO paid services — every component must run on a free tier
•	ONE command start — docker-compose up or npm run dev must work immediately
•	STREAMING first — every LLM response streams token-by-token
•	TYPED end-to-end — TypeScript on frontend, Pydantic on backend, no 'any'
•	BEAUTIFUL UI — not a demo toy; looks like a $50/month SaaS product
•	DEPLOYABLE — single git push deploys everything to Vercel + Render

1.3 Free Tier Stack — Cost Breakdown
Service	Free Tier Limit	Why It's Enough
Supabase	500MB DB + 1GB storage + 2 projects	Vector store + file refs + auth — more than enough for demo
Vercel	100GB bandwidth + unlimited deploys	Next.js frontend — zero config, custom domain supported
Render	750 hrs/month free web service	FastAPI backend — enough for always-on with 1 service
OpenAI	Pay per use (you have key)	text-embedding-3-small: $0.02/1M tokens — near zero cost
GitHub	Unlimited public repos	Source control + CI/CD triggers
Upstash Redis	10k commands/day free (optional)	Session caching — skip if unused

1.4 System Capabilities
User Can Do	System Does
Upload PDF, DOCX, TXT, CSV, Markdown	Parse → chunk → embed → store in pgvector
Paste any URL (website, blog, docs page)	Scrape → clean → chunk → embed → store
Type a question in plain English	Retrieve top-K chunks → synthesize → stream answer
Ask follow-up questions	Full conversation memory with context injection
See exactly what sources were used	Source citation panel with chunk preview + page ref
Manage multiple document collections	Projects/namespaces with isolated vector spaces
See token usage and cost estimate	Live cost tracker per query and cumulative
 
2. Complete Repository Structure
Cursor must create this EXACT structure. Every file listed must be created.

# Repository Root: enterprise-rag/
enterprise-rag/
├── backend/                    # FastAPI Python application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── config.py           # All settings via pydantic-settings
│   │   ├── dependencies.py     # Shared DI (db, openai client, etc.)
│   │   │
│   │   ├── api/                # Route handlers
│   │   │   ├── __init__.py
│   │   │   ├── documents.py    # Upload, list, delete documents
│   │   │   ├── chat.py         # Streaming chat endpoint
│   │   │   ├── projects.py     # Project/namespace CRUD
│   │   │   └── health.py       # Health check + readiness
│   │   │
│   │   ├── core/               # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── ingestion/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── loader.py       # File type detection + dispatch
│   │   │   │   ├── parsers.py      # PDF/DOCX/TXT/CSV/URL parsers
│   │   │   │   ├── chunker.py      # Semantic chunking logic
│   │   │   │   └── embedder.py     # OpenAI embedding wrapper
│   │   │   ├── retrieval/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── retriever.py    # pgvector similarity search
│   │   │   │   ├── reranker.py     # Cross-encoder re-ranking
│   │   │   │   └── query_expander.py # Multi-query expansion
│   │   │   └── generation/
│   │   │       ├── __init__.py
│   │   │       ├── prompts.py      # All system/user prompt templates
│   │   │       └── chain.py        # RAG chain + streaming
│   │   │
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── client.py       # Supabase async client singleton
│   │   │   ├── models.py       # SQLModel table definitions
│   │   │   └── migrations/
│   │   │       └── 001_initial.sql  # Full schema SQL
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── file_utils.py   # MIME type, size validation
│   │       ├── text_utils.py   # Cleaning, normalization
│   │       └── cost_tracker.py # Token count + cost estimate
│   │
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_ingestion.py
│   │   ├── test_retrieval.py
│   │   └── test_chat.py
│   │
│   ├── requirements.txt        # Pinned Python deps
│   ├── Dockerfile              # Production Docker image
│   ├── .env.example            # Template — never commit real .env
│   └── render.yaml             # Render deployment config
│
├── frontend/                   # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout + fonts + providers
│   │   │   ├── page.tsx            # Landing / redirect to /chat
│   │   │   ├── globals.css         # Tailwind base + custom vars
│   │   │   ├── (auth)/
│   │   │   │   └── login/page.tsx  # Supabase magic link login
│   │   │   └── (app)/
│   │   │       ├── layout.tsx      # App shell with sidebar
│   │   │       ├── chat/
│   │   │       │   ├── page.tsx            # Default empty chat
│   │   │       │   └── [projectId]/
│   │   │       │       └── page.tsx        # Chat with sources
│   │   │       └── projects/
│   │   │           ├── page.tsx            # Project list
│   │   │           └── [projectId]/
│   │   │               └── page.tsx        # Project settings + docs
│   │   │
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.tsx      # Main chat container
│   │   │   │   ├── MessageBubble.tsx   # User/assistant message
│   │   │   │   ├── SourcePanel.tsx     # Cited sources sidebar
│   │   │   │   ├── StreamingText.tsx   # Token-by-token render
│   │   │   │   ├── ChatInput.tsx       # Input + send button
│   │   │   │   └── CostBadge.tsx       # Query cost display
│   │   │   ├── documents/
│   │   │   │   ├── UploadZone.tsx      # Drag-drop + file picker
│   │   │   │   ├── DocumentList.tsx    # Uploaded docs table
│   │   │   │   ├── UploadProgress.tsx  # Processing progress bar
│   │   │   │   └── URLIngestion.tsx    # URL input + scrape
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx         # Navigation + projects
│   │   │   │   ├── TopBar.tsx          # Breadcrumbs + user menu
│   │   │   │   └── ProjectSwitcher.tsx # Dropdown project selector
│   │   │   └── shared/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useChat.ts          # SSE streaming + history
│   │   │   ├── useDocuments.ts     # Upload + list + delete
│   │   │   ├── useProjects.ts      # Project CRUD
│   │   │   └── useSupabase.ts      # Auth + session
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts          # Typed fetch wrapper for backend
│   │   │   ├── supabase.ts     # Supabase client (browser)
│   │   │   ├── supabase-server.ts  # Supabase client (server)
│   │   │   └── utils.ts        # cn(), formatters
│   │   │
│   │   └── types/
│   │       ├── api.ts          # Request/Response types
│   │       ├── chat.ts         # Message, Source, Citation
│   │       └── database.ts     # Supabase generated types
│   │
│   ├── public/
│   │   └── og-image.png
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── .env.local.example
│
├── docker-compose.yml          # Local dev: frontend + backend + postgres
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI: test → deploy backend → deploy frontend
├── README.md
└── .gitignore

 
3. Database Schema — Supabase / PostgreSQL
Run this SQL in Supabase SQL Editor. Enable pgvector extension first.

3.1 Enable Extensions
-- Supabase SQL Editor: Step 1
-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

3.2 Tables
-- 001_initial.sql
-- PROJECTS: isolated namespaces for document sets
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- DOCUMENTS: metadata for each uploaded file
CREATE TABLE documents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename     TEXT NOT NULL,
  source_url   TEXT,            -- set if ingested from URL
  file_type    TEXT NOT NULL,   -- 'pdf','docx','txt','csv','url'
  file_size    INTEGER,         -- bytes
  chunk_count  INTEGER DEFAULT 0,
  status       TEXT DEFAULT 'pending',  -- pending|processing|ready|error
  error_msg    TEXT,
  storage_path TEXT,            -- Supabase Storage path
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- CHUNKS: the actual text chunks with embeddings
CREATE TABLE chunks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id  UUID REFERENCES documents(id) ON DELETE CASCADE,
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  embedding    vector(1536),    -- OpenAI text-embedding-3-small dim
  chunk_index  INTEGER NOT NULL,
  page_number  INTEGER,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSATIONS: chat session metadata
CREATE TABLE conversations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT DEFAULT 'New Conversation',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES: individual chat messages
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content         TEXT NOT NULL,
  sources         JSONB DEFAULT '[]',  -- cited chunk IDs + preview
  token_count     INTEGER,
  cost_usd        NUMERIC(10,6),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX for fast vector similarity search
CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- INDEX for project filtering
CREATE INDEX ON chunks (project_id);
CREATE INDEX ON documents (project_id, status);
CREATE INDEX ON messages (conversation_id, created_at);

-- ROW LEVEL SECURITY
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE chunks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages     ENABLE ROW LEVEL SECURITY;

-- RLS policies (users only see their own data)
CREATE POLICY "own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "project chunks" ON chunks
  FOR SELECT USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));
CREATE POLICY "own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own messages" ON messages
  FOR ALL USING (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));

-- STORAGE BUCKET for uploaded files
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

CREATE POLICY "upload own docs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "read own docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "delete own docs" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

3.3 Vector Search Function
-- Create reusable search function
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_project_id UUID,
  match_count INT DEFAULT 8
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  metadata JSONB,
  page_number INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id, c.document_id, c.content, c.metadata, c.page_number,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM chunks c
  WHERE c.project_id = match_project_id
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

 
4. Backend — FastAPI Implementation
4.1 requirements.txt
backend/requirements.txt
# Core
fastapi==0.115.0
uvicorn[standard]==0.30.0
pydantic==2.8.0
pydantic-settings==2.4.0
python-multipart==0.0.9

# Supabase
supabase==2.7.0

# OpenAI
openai==1.45.0
tiktoken==0.7.0

# Document parsing
pypdf2==3.0.1
python-docx==1.1.2
pandas==2.2.0
openpyxl==3.1.5

# Web scraping
httpx==0.27.0
beautifulsoup4==4.12.3
lxml==5.3.0

# Text processing
langchain-text-splitters==0.2.4
nltk==3.9.0

# Async
anyio==4.4.0
aiofiles==24.1.0

# Dev
pytest==8.3.0
pytest-asyncio==0.24.0
httpx==0.27.0

4.2 config.py — All Environment Variables
backend/app/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    app_name: str = 'Enterprise RAG Platform'
    debug: bool = False
    cors_origins: list[str] = ['http://localhost:3000']

    # OpenAI
    openai_api_key: str
    embedding_model: str = 'text-embedding-3-small'
    embedding_dim: int = 1536
    chat_model: str = 'gpt-4o-mini'          # cheap for most queries
    chat_model_smart: str = 'gpt-4o'          # complex queries
    max_tokens: int = 2048

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    # RAG
    chunk_size: int = 800
    chunk_overlap: int = 150
    top_k_retrieval: int = 8
    top_k_rerank: int = 4
    min_similarity: float = 0.35

    # Limits
    max_file_size_mb: int = 50
    max_files_per_project: int = 100

    class Config:
        env_file = '.env'

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

4.3 main.py — FastAPI App
backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.api import documents, chat, projects, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    import nltk
    nltk.download('punkt', quiet=True)
    yield
    # shutdown — clean up if needed

app = FastAPI(
    title=settings.app_name,
    version='1.0.0',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router,    tags=['health'])
app.include_router(projects.router,  prefix='/api/projects',  tags=['projects'])
app.include_router(documents.router, prefix='/api/documents', tags=['documents'])
app.include_router(chat.router,      prefix='/api/chat',      tags=['chat'])

4.4 Ingestion Pipeline
parsers.py — Document Parsers
backend/app/core/ingestion/parsers.py
import io, csv
from pathlib import Path
import httpx
from bs4 import BeautifulSoup
import PyPDF2
from docx import Document as DocxDocument
from dataclasses import dataclass

@dataclass
class ParsedDocument:
    text: str
    metadata: dict
    page_map: dict[int, str]  # page_number -> text

def parse_pdf(file_bytes: bytes, filename: str) -> ParsedDocument:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    page_map = {}
    full_text = []
    for i, page in enumerate(reader.pages, 1):
        text = page.extract_text() or ''
        page_map[i] = text
        full_text.append(text)
    return ParsedDocument(
        text='\n\n'.join(full_text),
        metadata={'filename': filename, 'page_count': len(reader.pages)},
        page_map=page_map
    )

def parse_docx(file_bytes: bytes, filename: str) -> ParsedDocument:
    doc = DocxDocument(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    text = '\n\n'.join(paragraphs)
    return ParsedDocument(
        text=text,
        metadata={'filename': filename},
        page_map={1: text}
    )

def parse_txt(file_bytes: bytes, filename: str) -> ParsedDocument:
    text = file_bytes.decode('utf-8', errors='replace')
    return ParsedDocument(text=text, metadata={'filename': filename}, page_map={1: text})

def parse_csv(file_bytes: bytes, filename: str) -> ParsedDocument:
    reader = csv.DictReader(io.StringIO(file_bytes.decode('utf-8', errors='replace')))
    rows = list(reader)
    text = '\n'.join([str(row) for row in rows])
    return ParsedDocument(text=text, metadata={'filename': filename, 'row_count': len(rows)}, page_map={1: text})

async def parse_url(url: str) -> ParsedDocument:
    async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
        resp = await client.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'lxml')
    # Remove nav, footer, scripts
    for tag in soup(['script','style','nav','footer','header','aside']):
        tag.decompose()
    text = soup.get_text(separator='\n', strip=True)
    return ParsedDocument(
        text=text,
        metadata={'source_url': url, 'title': soup.title.string if soup.title else url},
        page_map={1: text}
    )

def dispatch_parser(file_bytes: bytes, filename: str, mime: str) -> ParsedDocument:
    ext = Path(filename).suffix.lower()
    if ext == '.pdf' or 'pdf' in mime:  return parse_pdf(file_bytes, filename)
    if ext in ('.docx','.doc'):          return parse_docx(file_bytes, filename)
    if ext in ('.csv',):                 return parse_csv(file_bytes, filename)
    return parse_txt(file_bytes, filename)  # default

chunker.py — Semantic Chunking
backend/app/core/ingestion/chunker.py
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings
from dataclasses import dataclass

@dataclass
class TextChunk:
    content: str
    chunk_index: int
    page_number: int
    metadata: dict

def chunk_document(parsed_doc, document_id: str) -> list[TextChunk]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=['\n\n', '\n', '. ', '! ', '? ', ' ', ''],
        length_function=len,
    )
    # Use page-aware chunking
    chunks = []
    chunk_idx = 0
    for page_num, page_text in parsed_doc.page_map.items():
        if not page_text.strip():
            continue
        splits = splitter.split_text(page_text)
        for split in splits:
            if len(split.strip()) < 50:  # skip tiny fragments
                continue
            chunks.append(TextChunk(
                content=split.strip(),
                chunk_index=chunk_idx,
                page_number=page_num,
                metadata={**parsed_doc.metadata, 'document_id': document_id}
            ))
            chunk_idx += 1
    return chunks

embedder.py — OpenAI Embeddings
backend/app/core/ingestion/embedder.py
from openai import AsyncOpenAI
from app.config import settings
import asyncio

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed up to 2048 texts in batches of 100."""
    all_embeddings = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = await client.embeddings.create(
            model=settings.embedding_model,
            input=batch,
            dimensions=settings.embedding_dim,
        )
        all_embeddings.extend([e.embedding for e in response.data])
    return all_embeddings

async def embed_query(text: str) -> list[float]:
    response = await client.embeddings.create(
        model=settings.embedding_model,
        input=[text],
        dimensions=settings.embedding_dim,
    )
    return response.data[0].embedding

4.5 Retrieval Pipeline
retriever.py — pgvector Search
backend/app/core/retrieval/retriever.py
from app.db.client import get_supabase
from app.core.ingestion.embedder import embed_query
from app.config import settings
from dataclasses import dataclass

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
    top_k: int = None,
) -> list[RetrievedChunk]:
    top_k = top_k or settings.top_k_retrieval
    query_embedding = await embed_query(query)
    supabase = get_supabase()
    result = supabase.rpc('match_chunks', {
        'query_embedding': query_embedding,
        'match_project_id': project_id,
        'match_count': top_k,
    }).execute()
    chunks = []
    for row in result.data:
        if row['similarity'] >= settings.min_similarity:
            chunks.append(RetrievedChunk(**row))
    return chunks

query_expander.py — Multi-Query Expansion
backend/app/core/retrieval/query_expander.py
from openai import AsyncOpenAI
from app.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

EXPAND_PROMPT = '''Generate 3 different search queries for the same question.
Return ONLY the queries, one per line, no numbering.
Question: {question}'''

async def expand_query(question: str) -> list[str]:
    """Generate 3 query variants to maximize retrieval recall."""
    response = await client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': EXPAND_PROMPT.format(question=question)}],
        temperature=0.7,
        max_tokens=200,
    )
    variants = response.choices[0].message.content.strip().split('\n')
    return [question] + [v.strip() for v in variants if v.strip()][:3]

4.6 Generation — RAG Chain with Streaming
prompts.py
backend/app/core/generation/prompts.py
SYSTEM_PROMPT = """You are a precise, helpful assistant answering questions
based ONLY on the provided context documents.

Rules:
- Answer using ONLY information from the context below
- If the context doesn't contain the answer, say: 'I couldn't find that in the
  uploaded documents. Try uploading more relevant files.'
- Always cite sources using [Doc N] notation where N is the document number
- Be concise but complete — avoid padding
- Format with markdown: use **bold**, bullet lists, and code blocks when helpful

Context documents:
{context}

Previous conversation:
{history}"""

def build_context(chunks: list) -> str:
    parts = []
    for i, chunk in enumerate(chunks, 1):
        parts.append(f'[Doc {i}] (page {chunk.page_number}, similarity: {chunk.similarity:.0%})\n{chunk.content}')
    return '\n\n---\n\n'.join(parts)

def build_history(messages: list[dict]) -> str:
    if not messages:
        return 'No previous messages.'
    lines = []
    for msg in messages[-6:]:  # last 3 turns
        lines.append(f"{msg['role'].upper()}: {msg['content'][:500]}")
    return '\n'.join(lines)

chain.py — Streaming RAG Response
backend/app/core/generation/chain.py
from openai import AsyncOpenAI
from app.config import settings
from app.core.generation.prompts import SYSTEM_PROMPT, build_context, build_history
from app.core.retrieval.retriever import retrieve_chunks
from app.core.retrieval.query_expander import expand_query
from app.utils.cost_tracker import estimate_cost
import asyncio, json

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def rag_stream(
    question: str,
    project_id: str,
    history: list[dict],
):
    """
    Async generator yielding SSE events:
    - data: {type: 'chunk', content: str}
    - data: {type: 'sources', sources: [...]}
    - data: {type: 'cost', tokens: int, cost_usd: float}
    - data: {type: 'done'}
    """
    # 1. Multi-query expansion
    queries = await expand_query(question)

    # 2. Retrieve for all query variants, deduplicate by chunk ID
    seen_ids = set()
    all_chunks = []
    tasks = [retrieve_chunks(q, project_id) for q in queries]
    results = await asyncio.gather(*tasks)
    for chunk_list in results:
        for chunk in chunk_list:
            if chunk.id not in seen_ids:
                seen_ids.add(chunk.id)
                all_chunks.append(chunk)

    # 3. Sort by similarity, take top_k_rerank
    all_chunks.sort(key=lambda x: x.similarity, reverse=True)
    top_chunks = all_chunks[:settings.top_k_rerank]

    # 4. Build prompt
    context = build_context(top_chunks)
    hist_str = build_history(history)
    system_msg = SYSTEM_PROMPT.format(context=context, history=hist_str)

    # 5. Stream from OpenAI
    total_tokens = 0
    stream = await client.chat.completions.create(
        model=settings.chat_model,
        messages=[
            {'role': 'system', 'content': system_msg},
            {'role': 'user', 'content': question},
        ],
        max_tokens=settings.max_tokens,
        temperature=0.1,
        stream=True,
        stream_options={'include_usage': True},
    )

    async for event in stream:
        if event.choices and event.choices[0].delta.content:
            token = event.choices[0].delta.content
            yield f"data: {json.dumps({'type': 'chunk', 'content': token})}\n\n"
        if event.usage:
            total_tokens = event.usage.total_tokens

    # 6. Send sources
    sources = [
        {'id': c.id, 'document_id': c.document_id, 'content': c.content[:300],
         'page': c.page_number, 'similarity': round(c.similarity, 3)}
        for c in top_chunks
    ]
    yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

    # 7. Send cost
    cost = estimate_cost(total_tokens, settings.chat_model)
    yield f"data: {json.dumps({'type': 'cost', 'tokens': total_tokens, 'cost_usd': cost})}\n\n"
    yield f"data: {json.dumps({'type': 'done'})}\n\n"

4.7 API Routes
chat.py — Streaming Chat Endpoint
backend/app/api/chat.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.core.generation.chain import rag_stream
from app.db.client import get_supabase

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    project_id: str
    conversation_id: str | None = None
    history: list[dict] = []

@router.post('/stream')
async def stream_chat(req: ChatRequest):
    if not req.question.strip():
        raise HTTPException(400, 'Question cannot be empty')
    return StreamingResponse(
        rag_stream(req.question, req.project_id, req.history),
        media_type='text/event-stream',
        headers={'X-Accel-Buffering': 'no', 'Cache-Control': 'no-cache'},
    )

documents.py — Upload & Ingest
backend/app/api/documents.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.core.ingestion.loader import ingest_file, ingest_url
from app.db.client import get_supabase
from app.config import settings
import uuid

router = APIRouter()

@router.post('/upload')
async def upload_document(
    project_id: str = Form(...),
    file: UploadFile = File(...),
):
    if file.size and file.size > settings.max_file_size_mb * 1024 * 1024:
        raise HTTPException(400, f'File too large. Max: {settings.max_file_size_mb}MB')
    file_bytes = await file.read()
    doc_id = str(uuid.uuid4())
    # Ingest async (returns immediately, processes in background)
    import asyncio
    asyncio.create_task(ingest_file(file_bytes, file.filename, file.content_type, project_id, doc_id))
    return {'document_id': doc_id, 'status': 'processing'}

@router.post('/ingest-url')
async def ingest_url_endpoint(body: dict):
    url = body.get('url', '').strip()
    project_id = body.get('project_id', '').strip()
    if not url or not project_id:
        raise HTTPException(400, 'url and project_id required')
    doc_id = str(uuid.uuid4())
    import asyncio
    asyncio.create_task(ingest_url(url, project_id, doc_id))
    return {'document_id': doc_id, 'status': 'processing'}

@router.get('/{project_id}')
async def list_documents(project_id: str):
    supabase = get_supabase()
    result = supabase.table('documents').select('*').eq('project_id', project_id).order('created_at', desc=True).execute()
    return result.data

@router.delete('/{document_id}')
async def delete_document(document_id: str):
    supabase = get_supabase()
    supabase.table('chunks').delete().eq('document_id', document_id).execute()
    supabase.table('documents').delete().eq('id', document_id).execute()
    return {'deleted': True}

 
5. Frontend — Next.js 14 Implementation
5.1 package.json
frontend/package.json (dependencies section)
{
  "dependencies": {
    "next": "14.2.x",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "tailwindcss": "^3.4",
    "@tailwindcss/typography": "^0.5",
    "framer-motion": "^11",
    "lucide-react": "^0.446",
    "react-dropzone": "^14",
    "react-markdown": "^9",
    "remark-gfm": "^4",
    "rehype-highlight": "^7",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "@radix-ui/react-dialog": "^1",
    "@radix-ui/react-tooltip": "^1",
    "@radix-ui/react-dropdown-menu": "^2",
    "sonner": "^1.5"
  }
}

5.2 Design System — tailwind.config.ts
frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
          500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          900: '#1e3a8a',
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'typing':     'blink 1s step-end infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity:'0' }, to: { opacity:'1' } },
        slideUp: { from: { opacity:'0', transform:'translateY(8px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        blink:   { '0%,100%': { opacity:'1' }, '50%': { opacity:'0' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config

5.3 Root Layout — globals.css
frontend/src/app/globals.css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary:   #0f172a;
  --bg-secondary: #1e293b;
  --bg-card:      #1e2d3d;
  --accent:       #3b82f6;
  --accent-glow:  rgba(59,130,246,0.15);
  --text-primary: #f1f5f9;
  --text-muted:   #64748b;
  --border:       rgba(148,163,184,0.1);
}

* { box-sizing: border-box; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Custom scrollbar */
::-webkit-scrollbar       { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #475569; }

/* Glowing border effect for focused inputs */
.glow-border:focus {
  box-shadow: 0 0 0 1px #3b82f6, 0 0 20px rgba(59,130,246,0.2);
}

5.4 App Shell — Sidebar Layout
frontend/src/components/layout/Sidebar.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, FolderOpen, Upload, Settings, ChevronLeft,
         Plus, Sparkles } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { projects, loading } = useProjects()
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className='relative h-screen bg-surface-900 border-r border-white/5
                 flex flex-col overflow-hidden flex-shrink-0'
    >
      {/* Logo */}
      <div className='h-16 flex items-center px-4 border-b border-white/5'>
        {!collapsed && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center'>
              <Sparkles size={16} className='text-white' />
            </div>
            <span className='font-bold text-white text-sm'>RAG Platform</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('ml-auto p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors',
                         collapsed && 'mx-auto')}
        >
          <ChevronLeft size={16} className={cn('transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* New Chat button */}
      <div className='p-3'>
        <Link href='/chat'
          className={cn('flex items-center gap-2 w-full px-3 py-2 rounded-lg
                         bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium
                         transition-all group', collapsed && 'justify-center')}
        >
          <Plus size={16} />
          {!collapsed && <span>New Chat</span>}
        </Link>
      </div>

      {/* Projects list */}
      {!collapsed && (
        <div className='flex-1 overflow-y-auto px-3 space-y-0.5'>
          <p className='text-xs font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider mt-2'>
            Projects
          </p>
          {projects.map(project => (
            <Link key={project.id}
              href={`/chat/${project.id}`}
              className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                             text-slate-400 hover:text-white hover:bg-white/5 transition-all group',
                             pathname.includes(project.id) && 'bg-brand-600/10 text-brand-400 border border-brand-600/20')}
            >
              <FolderOpen size={14} />
              <span className='truncate'>{project.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <div className='p-3 border-t border-white/5 space-y-0.5'>
        {[
          { href: '/projects', icon: FolderOpen, label: 'Projects' },
          { href: '/settings', icon: Settings, label: 'Settings' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                           text-slate-400 hover:text-white hover:bg-white/5 transition-all',
                           collapsed && 'justify-center')}
          >
            <item.icon size={16} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </motion.aside>
  )
}

5.5 ChatWindow — Core Chat Component
frontend/src/components/chat/ChatWindow.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { SourcePanel } from './SourcePanel'
import { useChat } from '@/hooks/useChat'
import { EmptyState } from '../shared/EmptyState'

export function ChatWindow({ projectId }: { projectId: string }) {
  const { messages, sources, isStreaming, sendMessage, cost } = useChat(projectId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showSources, setShowSources] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  return (
    <div className='flex h-full'>
      {/* Main chat area */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Messages */}
        <div className='flex-1 overflow-y-auto px-4 py-6 space-y-6'>
          {messages.length === 0 ? (
            <EmptyState
              title='Ask anything about your documents'
              description='Upload documents in Projects, then start asking questions.'
            />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageBubble message={msg} />
                </motion.div>
              ))}
              {isStreaming && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}
                  className='flex gap-2 items-center text-slate-400 text-sm pl-2'>
                  <div className='w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow' />
                  Thinking...
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className='border-t border-white/5 bg-surface-900/50 backdrop-blur p-4'>
          {cost && (
            <div className='text-xs text-slate-500 mb-2 text-right'>
              Last query: {cost.tokens} tokens · ~${cost.cost_usd.toFixed(4)}
            </div>
          )}
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>

      {/* Sources panel */}
      <AnimatePresence>
        {sources.length > 0 && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className='border-l border-white/5 overflow-hidden flex-shrink-0'
          >
            <SourcePanel sources={sources} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

5.6 useChat Hook — SSE Streaming
frontend/src/hooks/useChat.ts
import { useState, useCallback } from 'react'
import type { Message, Source, CostInfo } from '@/types/chat'

export function useChat(projectId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sources,  setSources]  = useState<Source[]>([])
  const [cost,     setCost]     = useState<CostInfo | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isStreaming) return

    const userMsg: Message = { role: 'user', content: question }
    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, userMsg, assistantMsg])
    setSources([])
    setIsStreaming(true)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        project_id: projectId,
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
      }),
    })

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const event = JSON.parse(line.slice(6))
          if (event.type === 'chunk') {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + event.content,
              }
              return updated
            })
          } else if (event.type === 'sources') {
            setSources(event.sources)
          } else if (event.type === 'cost') {
            setCost({ tokens: event.tokens, cost_usd: event.cost_usd })
          }
        } catch { /* skip malformed */ }
      }
    }
    setIsStreaming(false)
  }, [messages, isStreaming, projectId])

  return { messages, sources, cost, isStreaming, sendMessage }
}

5.7 UploadZone — Drag & Drop
frontend/src/components/documents/UploadZone.tsx
'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Globe, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'text/markdown': ['.md'],
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export function UploadZone({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)

  const onDrop = useCallback(async (files: File[]) => {
    setStatus('uploading')
    for (const file of files) {
      const form = new FormData()
      form.append('file', file)
      form.append('project_id', projectId)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/upload`, {
        method: 'POST', body: form,
      })
      if (!res.ok) { setStatus('error'); return }
    }
    setStatus('success')
    setTimeout(() => setStatus('idle'), 2000)
  }, [projectId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED_TYPES, maxSize: 50 * 1024 * 1024,
  })

  const ingestUrl = async () => {
    if (!urlInput.trim()) return
    setUrlLoading(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/ingest-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput, project_id: projectId }),
    })
    setUrlInput('')
    setUrlLoading(false)
  }

  return (
    <div className='space-y-4'>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive  ? 'border-brand-500 bg-brand-600/10 scale-[1.01]' : 'border-white/10 hover:border-white/20',
          status === 'success' && 'border-green-500/50 bg-green-500/5',
          status === 'error'   && 'border-red-500/50 bg-red-500/5',
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center gap-3'>
          {status === 'uploading' ? <Loader2 className='text-brand-400 animate-spin' size={32} />
          : status === 'success'  ? <CheckCircle className='text-green-400' size={32} />
          : status === 'error'    ? <XCircle className='text-red-400' size={32} />
          : <Upload className={cn('transition-colors', isDragActive ? 'text-brand-400' : 'text-slate-500')} size={32} />}
          <div>
            <p className='text-sm font-medium text-slate-300'>
              {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
            </p>
            <p className='text-xs text-slate-500 mt-1'>PDF, DOCX, TXT, CSV, MD — up to 50MB</p>
          </div>
        </div>
      </div>

      {/* URL ingestion */}
      <div className='flex gap-2'>
        <div className='flex-1 relative'>
          <Globe size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500' />
          <input
            type='url'
            placeholder='https://example.com/article...'
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ingestUrl()}
            className='w-full pl-8 pr-3 py-2.5 bg-surface-800 border border-white/10 rounded-lg
                       text-sm text-slate-300 placeholder-slate-600 glow-border
                       focus:outline-none transition-all'
          />
        </div>
        <button
          onClick={ingestUrl} disabled={urlLoading || !urlInput.trim()}
          className='px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50
                     text-white text-sm rounded-lg transition-all flex items-center gap-2'
        >
          {urlLoading ? <Loader2 size={14} className='animate-spin' /> : 'Ingest'}
        </button>
      </div>
    </div>
  )
}

 
6. Deployment — Zero Cost Setup
6.1 Environment Variables
backend/.env.example
backend/.env.example
# OpenAI (required — you already have this)
OPENAI_API_KEY=sk-...

# Supabase (get from supabase.com → project settings → API)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App
DEBUG=false
CORS_ORIGINS=["https://your-app.vercel.app","http://localhost:3000"]

frontend/.env.local.example
frontend/.env.local.example
# Backend (Render URL after deploy)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# Supabase (same project, anon key only on frontend)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

6.2 Backend Dockerfile — Render
backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system deps for lxml + pdf parsing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libxml2-dev libxslt-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

6.3 render.yaml — One-Click Backend Deploy
backend/render.yaml
services:
  - type: web
    name: rag-platform-api
    runtime: docker
    dockerfilePath: ./Dockerfile
    plan: free
    healthCheckPath: /api/health
    envVars:
      - key: OPENAI_API_KEY
        sync: false          # set manually in Render dashboard
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: CORS_ORIGINS
        value: '["https://your-app.vercel.app"]'

6.4 vercel.json — Frontend Config
frontend/vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}

6.5 docker-compose.yml — Local Development
docker-compose.yml
version: '3.9'
services:
  backend:
    build: ./backend
    ports:
      - '8000:8000'
    env_file: ./backend/.env
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

  frontend:
    image: node:20-alpine
    working_dir: /app
    ports:
      - '3000:3000'
    volumes:
      - ./frontend:/app
    env_file: ./frontend/.env.local
    command: sh -c 'npm install && npm run dev'

6.6 Step-by-Step Deploy Instructions for Cursor
Step 1 — Supabase Setup (5 min)
1.	Go to supabase.com → New Project → choose free tier
2.	Go to SQL Editor → paste and run the full SQL from Section 3
3.	Go to Settings → API → copy URL, anon key, service role key
4.	Go to Storage → create bucket named 'documents' (private)
Step 2 — Deploy Backend on Render (10 min)
5.	Push code to GitHub
6.	Go to render.com → New → Web Service → connect GitHub repo
7.	Select /backend folder, Docker runtime, Free plan
8.	Add all environment variables from .env.example
9.	Click Deploy — wait for green health check at /api/health
10.	Copy the Render URL (e.g. https://rag-api-xxxx.onrender.com)
Step 3 — Deploy Frontend on Vercel (5 min)
11.	Go to vercel.com → New Project → import GitHub repo
12.	Set root directory to /frontend
13.	Add environment variables: NEXT_PUBLIC_API_URL = Render URL
14.	Add Supabase env vars
15.	Click Deploy — Vercel auto-detects Next.js
16.	Update CORS_ORIGINS on Render to include Vercel URL
Step 4 — Verify Everything Works
✅  Visit Vercel URL → login page appears
✅  Create account → see empty project list
✅  Create project → upload a PDF → status changes to 'ready'
✅  Start chat → type a question → see streaming response with sources
 
7. UI Design Specification — Every Screen
ℹ️  Design philosophy: Dark, premium, SaaS-grade. Think Linear + Vercel + Notion AI combined. Every interaction must feel fast and intentional.

7.1 Color Tokens
Token	Value	Usage
--bg-primary	#0f172a (slate-900)	Main app background
--bg-secondary	#1e293b (slate-800)	Cards, sidebars
--bg-card	#1e2d3d	Elevated surfaces
--accent	#3b82f6 (blue-500)	Buttons, links, focus rings
--accent-glow	rgba(59,130,246,0.15)	Hover glows, selected states
--text-primary	#f1f5f9 (slate-100)	Headings, primary text
--text-secondary	#94a3b8 (slate-400)	Descriptions, labels
--text-muted	#64748b (slate-500)	Placeholders, timestamps
--border	rgba(148,163,184,0.1)	Dividers, card borders
--success	#22c55e (green-500)	Status ready, success states
--error	#ef4444 (red-500)	Status error, warnings

7.2 Screen Breakdown
Screen A — Login Page
•	Centered card on dark gradient background (radial from center)
•	Logo + 'RAG Platform' heading in white
•	Email input with glowing blue focus ring
•	'Send Magic Link' button — full width, blue gradient
•	No password required — Supabase magic link only
Screen B — Chat Page (Main Screen)
•	LEFT: Collapsible sidebar (260px → 64px) with project list
•	CENTER: Chat messages area — scrollable, message bubbles
•	User messages: right-aligned, blue bubble, white text
•	Assistant messages: left-aligned, dark card, markdown rendered with syntax highlighting
•	Typing indicator: three animated dots with fade pulsing
•	BOTTOM: Sticky input bar with token cost display above it
•	RIGHT: Source panel slides in (320px) after each response — shows cited chunks with similarity %
Screen C — Projects Page
•	Grid of project cards (3 columns on desktop, 1 on mobile)
•	Each card: project name, doc count badge, last active date, chat button
•	+ New Project card with dashed border — click to create
•	Hover state: card lifts with subtle shadow and border brightens
Screen D — Project Detail / Document Manager
•	TOP: Project title + edit button + Delete Project (destructive, requires confirm)
•	Upload zone (full Section 5.7 UploadZone component)
•	Document table: filename, type icon, status badge, chunk count, upload date, delete
•	Status badges: 'Processing' (yellow pulse) → 'Ready' (green) → 'Error' (red with message)
•	Real-time status polling every 3 seconds while any doc is 'processing'

7.3 Component Specs
Component	Key Props	Visual Spec
MessageBubble	role, content, isStreaming	User: right, rounded-2xl, bg-brand-600. Assistant: left, bg-slate-800, max-w-[80%]
SourcePanel	sources: Source[]	Each source: card with filename, page number, similarity bar (green 80%+, yellow 50-79%, red <50%)
ChatInput	onSend, disabled	Rounded-xl, dark bg, send button embedded right, Cmd+Enter shortcut, character count
UploadZone	projectId	Dashed border, drag highlight in blue, file type icons, progress bar during upload
StatusBadge	status: string	Dot indicator + text: green pulse for ready, yellow spin for processing, red for error
CostBadge	tokens, cost_usd	Top-right corner chip: gray text, shows '234 tokens · $0.0003'
 
8. Cursor Instructions — How to Use This Document
⚠️  Read this section FIRST before generating any code. It tells Cursor exactly how to approach the build.

8.1 Cursor System Prompt to Use
Copy and paste this into Cursor's system prompt field before starting:

CURSOR SYSTEM PROMPT
You are an expert full-stack engineer building a production RAG platform.
Follow this spec document EXACTLY. Key rules:

1. NEVER install paid services — every dependency must be free-tier compatible
2. Use EXACTLY the file structure from Section 2 — no deviations
3. All Python code uses async/await — no blocking calls
4. All TypeScript uses strict types — no 'any' type anywhere
5. Every API response is typed with Pydantic (backend) or TypeScript interfaces (frontend)
6. UI is dark mode only — use the exact color tokens from Section 7
7. Streaming is non-negotiable — chat responses must stream token-by-token
8. After creating each file, verify it imports correctly before moving on
9. Create .env.example files but NEVER create actual .env files
10. Every component must be mobile-responsive (Tailwind responsive classes)

8.2 Build Order for Cursor
Tell Cursor to build in this exact order to avoid import errors:
17.	Database: Run SQL from Section 3 in Supabase
18.	Backend foundation: config.py → dependencies.py → db/client.py → db/models.py
19.	Ingestion pipeline: parsers.py → chunker.py → embedder.py → loader.py
20.	Retrieval pipeline: retriever.py → query_expander.py → reranker.py
21.	Generation: prompts.py → chain.py
22.	API routes: health.py → projects.py → documents.py → chat.py
23.	Backend main.py + Dockerfile + requirements.txt
24.	Frontend: layout files → globals.css → tailwind.config
25.	Frontend: lib/ files (api.ts, supabase.ts, utils.ts)
26.	Frontend: types/ files
27.	Frontend: hooks/ files (useProjects, useDocuments, useChat)
28.	Frontend: components (layout → shared → documents → chat)
29.	Frontend: pages in order (login → projects → chat)
30.	Docker Compose + deployment configs
31.	README.md

8.3 Cursor Prompts Per Section
Use these exact prompts in sequence in Cursor:

Prompt 1 — Backend Foundation
Paste in Cursor Chat
Create the backend foundation following the spec document Section 4.
Start with: config.py, dependencies.py, db/client.py.
Use pydantic-settings for config. Use supabase-py for database.
All code must be async. Use the exact environment variable names from Section 6.1.

Prompt 2 — Ingestion Pipeline
Paste in Cursor Chat
Create the ingestion pipeline from Section 4.4:
parsers.py (PDF with PyPDF2, DOCX with python-docx, CSV, TXT, URL with httpx+beautifulsoup4),
chunker.py (RecursiveCharacterTextSplitter, page-aware),
embedder.py (OpenAI text-embedding-3-small, async batched),
loader.py (orchestrates parse → chunk → embed → store in Supabase).
The loader.py must update document status to 'processing' then 'ready' or 'error'.

Prompt 3 — RAG Chain
Paste in Cursor Chat
Create the RAG chain from Section 4.5 and 4.6:
retriever.py using Supabase match_chunks RPC function,
query_expander.py using GPT-4o-mini to generate 3 query variants,
prompts.py with SYSTEM_PROMPT that enforces source citation,
chain.py that orchestrates: expand → retrieve all → deduplicate → rerank → stream.
The stream must yield SSE events: chunk, sources, cost, done.

Prompt 4 — API Routes
Paste in Cursor Chat
Create all FastAPI routes from Section 4.7:
chat.py: POST /api/chat/stream returning StreamingResponse with SSE,
documents.py: POST /upload (multipart), POST /ingest-url, GET /{project_id}, DELETE /{doc_id},
projects.py: full CRUD,
health.py: GET /api/health returning {status: ok, timestamp}.
All routes must have proper error handling with HTTPException.
Then create main.py wiring everything together with CORS.

Prompt 5 — Frontend
Paste in Cursor Chat
Create the Next.js 14 frontend from Section 5.
Use App Router. Dark theme only using CSS variables from Section 7.
Create in this order: globals.css, layout.tsx, lib/api.ts, lib/supabase.ts,
types/, hooks/ (useChat with SSE streaming EXACTLY as in Section 5.6),
then components in order: Sidebar, TopBar, UploadZone, ChatWindow, MessageBubble,
SourcePanel, ChatInput.
The ChatWindow MUST show sources panel sliding in from the right after each response.
Messages must render markdown with syntax highlighting using react-markdown + rehype-highlight.

Prompt 6 — Polish & Deploy
Paste in Cursor Chat
Add final polish and deployment config:
1. Add framer-motion animations to MessageBubble (slide-up on appear)
2. Add real-time document status polling in DocumentList (refetch every 3s if any doc is 'processing')
3. Create Dockerfile for backend, render.yaml, vercel.json, docker-compose.yml as per Section 6
4. Create a comprehensive README.md with: demo GIF placeholder, tech stack badges, setup in 3 steps
5. Add sonner toast notifications for upload success/error
6. Verify all TypeScript types are strict (no 'any')
7. Run build and fix any type errors

 
9. Pre-Launch Quality Checklist
	Check	How to Verify	
●	Backend responds at /api/health	curl https://your-render-url/api/health	☐
○	PDF upload processes to 'ready' status	Upload a 10-page PDF, wait 30s, check status	☐
●	Chat streams responses token by token	Open browser DevTools Network → SSE stream shows chunks	☐
○	Sources appear after each answer	Ask a question about uploaded doc — source panel slides in	☐
●	Cost badge shows token count + USD	Visible above chat input after each query	☐
○	URL ingestion works	Paste a Wikipedia article URL, wait, then ask about it	☐
●	Mobile layout works	Open on phone — sidebar collapses, chat is usable	☐
○	Dark mode renders correctly	No white flashes, all text readable on dark bg	☐
●	Delete document removes chunks	Delete a doc, ask about its content — system says not found	☐
○	Multiple projects are isolated	Create 2 projects with different docs — no cross-contamination	☐
●	Frontend Vercel deploy works	git push → Vercel builds without errors	☐
○	Backend Render deploy works	render.yaml deploys cleanly, health check passes	☐
●	Environment variables NOT in git	.env files in .gitignore — only .example files committed	☐
○	TypeScript builds without errors	npm run build in /frontend exits with code 0	☐
●	CORS only allows Vercel domain	Try calling API from random origin — should get 403	☐

9.1 Performance Targets
Metric	Target	Acceptable
Time to first streaming token	< 1.5 seconds	< 3 seconds
PDF ingestion (10 pages)	< 15 seconds	< 30 seconds
Vector search latency	< 200ms	< 500ms
Frontend page load (cold)	< 2 seconds	< 4 seconds
Chat response quality (relevance)	Answers use uploaded content	Never hallucinates facts

9.2 Cost Estimation
Usage Scenario	Monthly OpenAI Cost	Notes
Light: 100 uploads + 500 queries	~$0.50	text-embedding-3-small is cheap
Medium: 500 uploads + 2000 queries	~$2.00	gpt-4o-mini keeps costs low
Heavy: 2000 uploads + 10000 queries	~$8.00	Switch to gpt-4o for complex only



This document is the complete specification. No assumptions should be made beyond what is written here.
Build it. Ship it. Star it. 🚀
