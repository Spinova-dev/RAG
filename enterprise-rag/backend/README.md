## Backend – FastAPI RAG Service

This directory contains the **FastAPI** backend for the Enterprise RAG Platform. It exposes APIs for:

- Project management
- Document ingestion (files + URLs)
- Chunk and embedding storage in Supabase
- Retrieval and RAG generation
- Streaming chat responses to the frontend via SSE

---

## 📁 Structure

```text
backend/
  app/
    api/
      chat.py        # /api/chat/stream – streaming chat endpoint
      documents.py   # /api/documents/* – upload, list, delete, ingest-url
      projects.py    # /api/projects/* – CRUD for projects
      health.py      # /api/health – health check
    core/
      ingestion/     # loader, parsers, chunker, embedder
      retrieval/     # retriever, query_expander, reranker
      generation/    # prompts + RAG chain (streaming)
    db/
      client.py      # Supabase client (singleton)
      models.py      # Dataclass models mirroring DB schema
    utils/
      cost_tracker.py # token counting + cost estimation
    config.py        # Pydantic Settings – env‑driven config
    main.py          # FastAPI app, CORS, router registration
  requirements.txt
  Dockerfile
  .env.example
  render.yaml        # optional Render.com configuration
```

---

## 🔧 Configuration

The backend is configured via environment variables loaded by `Settings` in `app/config.py`:

- **OpenAI**
  - `OPENAI_API_KEY` – your OpenAI key
  - `EMBEDDING_MODEL` (optional, default `text-embedding-3-small`)
  - `CHAT_MODEL` (optional, default `gpt-4o-mini`)
  - `CHAT_MODEL_SMART` (optional, default `gpt-4o`)

- **Supabase**
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

- **RAG controls**
  - `CHUNK_SIZE` (default `800`)
  - `CHUNK_OVERLAP` (default `150`)
  - `TOP_K_RETRIEVAL` (default `8`)
  - `TOP_K_RERANK` (default `4`)
  - `MIN_SIMILARITY` (default `0.35`)

- **App**
  - `CORS_ORIGINS` – JSON list of allowed origins (`["https://your-frontend.vercel.app"]`)

See `.env.example` for an example configuration. Do **not** commit your actual `.env`.

---

## 🧪 Local Development

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate  # or source .venv/bin/activate
```

2. Install dependencies:

```bash
python -m pip install -r requirements.txt
```

3. Configure environment:

```bash
cp .env.example .env
# edit .env and fill in OpenAI + Supabase variables
```

4. Run the app:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Test health:

```bash
curl http://localhost:8000/api/health
```

---

## 📡 API Overview

### Health

- `GET /api/health` → `{ "status": "ok", "timestamp": "..." }`

### Projects

- `GET /api/projects/` – list projects
- `POST /api/projects/` – create project
  - body: `{ "name": string, "description": string | null }`
- `GET /api/projects/{project_id}` – get project details
- `PUT /api/projects/{project_id}` – update name/description
- `DELETE /api/projects/{project_id}` – delete project (cascades in DB)

### Documents

- `POST /api/documents/upload`
  - multipart form:
    - `project_id` – UUID
    - `file` – uploaded file (PDF, DOCX, TXT, CSV, MD)
  - response: `{ "document_id": <uuid>, "status": "processing" }`

- `POST /api/documents/ingest-url`
  - json: `{ "url": string, "project_id": string }`
  - response: `{ "document_id": <uuid>, "status": "processing" }`

- `GET /api/documents/{project_id}`
  - returns array of document records with status and chunk_count.

- `DELETE /api/documents/{document_id}`
  - deletes document and its chunks.

### Chat

- `POST /api/chat/stream`
  - json:
    - `question`: string
    - `project_id`: string (UUID)
    - `conversation_id`: optional
    - `history`: list of `{ role, content }`
  - response: **SSE** stream with events:
    - `{ "type": "chunk", "content": "..." }`
    - `{ "type": "sources", "sources": [...] }`
    - `{ "type": "cost", "tokens": int, "cost_usd": float }`
    - `{ "type": "done" }`

---

## 🧱 Ingestion & Retrieval Pipelines

### Ingestion

1. `documents.py` receives upload or URL.
2. `loader.py`:
   - Detects type and uses `parsers.py` to extract text.
   - `chunker.py` splits text into page‑aware semantic chunks.
   - `embedder.py` calls OpenAI embeddings in batches.
   - Inserts chunks into Supabase `chunks` table with embeddings.
   - Updates `documents.status` from `processing` → `ready` or `error`.

### Retrieval + Generation

1. `chat.py` receives question + project_id + history.
2. `query_expander.py` produces multiple query variants.
3. `retriever.py` calls Supabase `match_chunks` RPC for each variant.
4. Dedupe + sort chunks by similarity, keep top N.
5. `prompts.py` builds system prompt with citations; `build_history` summarizes previous messages.
6. `chain.py` streams OpenAI chat completion, emitting SSE events and computing cost via `cost_tracker`.

---

## 🐳 Docker & Cloud Deployment

- **Dockerfile** is optimized for:
  - Hugging Face Spaces (Docker Space, port `7860`).
  - Generic Docker hosts (Render, Railway, Fly, etc.).

Example run:

```bash
cd backend
docker build -t enterprise-rag-backend .
docker run -p 8000:7860 \
  -e OPENAI_API_KEY=... \
  -e SUPABASE_URL=... \
  -e SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  enterprise-rag-backend
```

---

## ✅ Testing & Hardening Ideas

Some directions to extend the backend:

- Add pytest suites for:
  - ingestion pipeline (parsers + chunker + loader)
  - retrieval correctness (given fixed embeddings)
  - chat endpoint (mocking OpenAI + Supabase)
- Implement background workers for large ingestions.
- Add rate limiting and API keys for multi‑tenant usage.
- Move `projects.user_id` to Supabase auth and enforce RLS fully.

