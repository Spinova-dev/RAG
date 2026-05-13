<h1 align="center">Enterprise RAG Platform</h1>

<p align="center">
Full‑stack Retrieval‑Augmented Generation (RAG) platform built with <b>FastAPI</b>, <b>Next.js 14</b>, <b>Supabase pgvector</b>, and <b>OpenAI</b>.
<br />
Chat with your PDFs, DOCX, TXT, CSV, and URLs in a beautiful SaaS‑style UI.
</p>

---

## 🚀 What This Project Is

This repository contains a production‑ready RAG platform:

- **Backend** – FastAPI service that handles document ingestion, chunking, embeddings, vector search, and streaming chat responses.
- **Frontend** – Next.js 14 App Router app that provides a polished chat interface, project management, document uploads, and source citations.
- **Vector Store & Auth** – Supabase Postgres with `pgvector` for similarity search and Supabase auth for user isolation (via RLS policies).
- **LLM & Embeddings** – OpenAI `text-embedding-3-small`, `gpt-4o-mini`, and `gpt-4o`.

The goal is to be a reference implementation you can show to clients, use in interviews, or extend into a real SaaS.

---

## ✨ Key Features

- **Multi‑project RAG** – Organize content into projects; each project has its own isolated vector space.
- **Multi‑modal ingestion** – Upload PDF, DOCX, TXT, CSV, Markdown, or ingest a URL.
- **Semantic chunking** – Page‑aware chunker using `RecursiveCharacterTextSplitter` with configurable size and overlap.
- **pgvector similarity search** – Supabase RPC function `match_chunks` for fast vector search.
- **Query expansion & reranking** – Multi‑query expansion with GPT and similarity‑based reranking.
- **Streaming chat** – Server‑Sent Events (SSE) streaming token‑by‑token to the frontend.
- **Source citations** – Right‑hand panel shows which chunks were used, with similarity score and preview.
- **Cost tracking** – Simple per‑query token + cost estimate using `tiktoken`.
- **Cloud‑native deployments** – FastAPI backend on Hugging Face Spaces (Docker), frontend on Vercel, Supabase for DB+storage.

---

## 🧩 Architecture Overview

High‑level architecture:

- **Frontend (Next.js 14, Vercel)**
  - App Router, React Server Components with client islands.
  - Project list, project documents page (upload + status), and per‑project chat.
  - Calls backend over REST + SSE (`/api/documents/*`, `/api/projects/*`, `/api/chat/stream`).

- **Backend (FastAPI, Hugging Face Space / Docker)**
  - Ingestion pipeline: detect file type → parse → chunk → embed → store in Supabase.
  - Retrieval pipeline: embed query → `match_chunks` RPC → multi‑query expansion → rerank.
  - Generation pipeline: build system prompt with context + history → stream chat completion.

- **Supabase**
  - Tables: `projects`, `documents`, `chunks`, `conversations`, `messages`.
  - `pgvector` index for `chunks.embedding`.
  - Storage bucket for raw files.
  - Row‑level security so users only see their own data.

- **OpenAI**
  - Embeddings: `text-embedding-3-small` (1536‑dim).
  - Chat: `gpt-4o-mini` (default) and `gpt-4o` for “smart” mode (configurable).

For a deeper dive into each side, see:

- [backend/README.md](./backend/README.md)
- [frontend/README.md](./frontend/README.md)

---

## 🗂 Repository Structure

```text
enterprise-rag/
  backend/         # FastAPI application (RAG backend)
    app/
      api/         # FastAPI routers: chat, documents, projects, health
      core/        # ingestion, retrieval, generation pipelines
      db/          # Supabase client + models
      utils/       # cost tracking utilities
      main.py      # FastAPI app entrypoint
      config.py    # Pydantic settings (env‑driven config)
    Dockerfile     # Backend Docker image (for Hugging Face Space or other hosts)
    render.yaml    # Example Render.com config (optional)
    requirements.txt

  frontend/        # Next.js 14 App Router UI
    src/app/       # routes: /, /chat, /chat/[projectId], /projects, /projects/[projectId]
    src/components # chat UI, layout, documents components
    src/hooks      # useChat, useDocuments, useProjects
    src/types      # shared TS types for API and chat
    package.json

  docker-compose.yml  # Local dev: backend + frontend
  .github/workflows/deploy.yml  # CI: build backend + frontend
  .gitignore
```

---

## ⚙️ Tech Stack

- **Frontend**
  - Next.js 14 (App Router, React 18)
  - TypeScript, Tailwind CSS, Framer Motion
  - react-markdown, rehype-highlight (markdown + code highlighting)
  - Supabase JS client for auth/session (extend as needed)

- **Backend**
  - FastAPI, Uvicorn
  - Pydantic v2, pydantic‑settings
  - Supabase Python client
  - OpenAI Python client
  - Langchain text splitters
  - PyPDF2, python‑docx, pandas, httpx, BeautifulSoup, lxml

- **Infra**
  - Supabase (Postgres + pgvector + Storage + Auth)
  - Hugging Face Spaces (Docker) for backend
  - Vercel for frontend

---

## 🧪 Running Locally

### Prerequisites

- Python 3.11+ (backend)
- Node.js 20+ and npm (frontend)
- Supabase project (or any Postgres + pgvector instance)
- OpenAI API key

### 1. Backend

```bash
cd backend
cp .env.example .env  # fill in OpenAI + Supabase credentials
python -m venv .venv
.venv/Scripts/activate  # or source .venv/bin/activate on Unix
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local  # set NEXT_PUBLIC_API_URL and Supabase vars
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`.

By default, the frontend expects `NEXT_PUBLIC_API_URL` to point to the backend (`http://localhost:8000` for local dev).

### 3. Using Docker Compose (optional)

```bash
docker-compose up --build
```

This builds and runs both backend and frontend containers for local development.

---

## ☁️ Deployment

### Backend (Hugging Face Spaces, Docker)

1. Create a **Docker Space** on Hugging Face.
2. Clone the Space repo and copy the contents of `backend/` into it:
   - `app/`, `requirements.txt`, `Dockerfile`.
3. Set environment variables in the Space settings:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CORS_ORIGINS` (JSON array, e.g. `["https://your-frontend.vercel.app"]`)
4. Commit & push. The Space builds and serves the FastAPI backend on port `7860`.

### Frontend (Vercel)

1. Push this repo to GitHub.
2. In Vercel:
   - Import the repo.
   - Set the **root directory** to `enterprise-rag/frontend`.
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL = https://your-space.hf.space`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Vercel will build the Next.js app and give you a public URL like `https://your-app.vercel.app`.

---

## 🧠 Business Use Cases

This platform is designed for:

- **Internal knowledge bases** – Connect teams to wikis, PDFs, and process docs with a chat interface.
- **Enterprise document QA** – Upload contracts, policies, technical specs, and let users ask precise questions.
- **Customer‑facing assistants** – Build product documentation chatbots for your customers.
- **Consulting & demos** – Impress clients or hiring managers with a full RAG stack, not just a notebook.

Because the core is built on free‑tier‑friendly services (Supabase, Vercel, Hugging Face Spaces), you can run a serious demo with minimal infrastructure cost (OpenAI usage only).

---

## 🤝 Contributing

Contributions and improvements are welcome:

- Open an issue for bugs, ideas, or questions.
- Fork the repo and create a PR with your changes.
- Good first contributions:
  - Add new file parsers (e.g., HTML, XLSX).
  - Improve the UI (mobile layout, dark‑mode polish).
  - Add tests for ingestion / retrieval / chat flows.

If you find this project useful, consider **starring the repository** on GitHub to help others discover it.

---


