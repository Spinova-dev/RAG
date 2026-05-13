## Frontend – Next.js 14 RAG Dashboard

This directory contains the **Next.js 14 App Router** frontend for the Enterprise RAG Platform. It provides:

- A dark, SaaS‑style UI for chatting with documents.
- Project management (list + detail views).
- Document upload and URL ingestion flows.
- Real‑time document status and a streaming chat experience.

---

## 📁 Structure

```text
frontend/
  src/
    app/
      layout.tsx          # Root layout and HTML shell
      page.tsx            # Landing page
      chat/
        page.tsx          # /chat – "select a project" screen
        [projectId]/page.tsx  # /chat/[projectId] – chat for a specific project
      projects/
        page.tsx          # /projects – list + create projects
        [projectId]/page.tsx  # /projects/[projectId] – documents for a project
      globals.css         # Global styles + Tailwind reset
    components/
      layout/Sidebar.tsx  # Collapsible sidebar with projects nav
      chat/*              # ChatWindow, MessageBubble, SourcePanel, ChatInput
      documents/*         # UploadZone, DocumentList
      shared/EmptyState.tsx
    hooks/
      useChat.ts          # SSE chat streaming + local state
      useDocuments.ts     # Document listing + polling for status
      useProjects.ts      # Fetch projects for sidebar + pages
    lib/utils.ts          # `cn` helper for className merging
    types/
      api.ts              # Project type
      chat.ts             # Message, Source, CostInfo types

  package.json
  tsconfig.json
  tailwind.config.ts
  next.config.mjs
  postcss.config.mjs
  .env.local.example
```

---

## 🧩 Key Screens

- **Landing (`/`)**
  - Simple hero that links into `/chat`.

- **Projects (`/projects`)**
  - Grid of project cards.
  - "New project" sidebar form to create a project via `POST /api/projects/`.

- **Project documents (`/projects/[projectId]`)**
  - Upload zone for files + URL ingestion.
  - Document table with:
    - filename, type, chunk count, status, uploaded time, delete action.
  - Auto‑refresh while any document is `processing`.
  - "Open chat" link into `/chat/[projectId]`.

- **Chat (`/chat/[projectId]`)**
  - Central messages pane with:
    - User messages (right, blue bubble).
    - Assistant messages (left, dark bubble with markdown + code highlighting).
  - Bottom fixed input with `Ctrl+Enter` / `Cmd+Enter` to send.
  - Right‑hand Sources panel that slides in after each answer.

---

## ⚙️ Configuration

Frontend configuration is driven by environment variables defined in `.env.local`:

- `NEXT_PUBLIC_API_URL` – Base URL of the backend (FastAPI) API.
  - Example local: `http://localhost:8000`
  - Example cloud: `https://your-space.hf.space`

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key.

These are set automatically in Vercel via Project → Settings → Environment Variables.

---

## 🧪 Local Development

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure environment:

```bash
cp .env.local.example .env.local
# edit .env.local and set NEXT_PUBLIC_API_URL + Supabase vars
```

3. Start dev server:

```bash
npm run dev
```

4. Visit `http://localhost:3000` in your browser.

---

## 🔌 Hooks & Data Flow

### `useProjects`

- Fetches projects from:

  ```ts
  GET `${process.env.NEXT_PUBLIC_API_URL}/api/projects/`
  ```

- Used by:
  - `Sidebar` to show project list.
  - `/projects` page to render project cards.

### `useDocuments`

- Fetches documents for a project:

  ```ts
  GET `${NEXT_PUBLIC_API_URL}/api/documents/${projectId}`
  ```

- If any doc has status `processing`, sets up an interval to refetch every 3 seconds.
- Used by `DocumentList` component.

### `useChat`

- Manages chat message state, sources, and cost.
- Sends a question via:

  ```ts
  POST `${NEXT_PUBLIC_API_URL}/api/chat/stream`
  ```

  and reads an SSE stream from `response.body`.

- Appends `"chunk"` events to the latest assistant message.
- Updates sources on `"sources"` events and cost on `"cost"`.

---

## 🎨 UI & Styling

- **Tailwind CSS** is used for layout, spacing, typography, and colors.
- Custom color tokens defined in `tailwind.config.ts`:
  - `brand.*` – primary blue brand colors.
  - `surface.*` – dark surfaces for cards/background.
- `globals.css` defines:
  - CSS variables for theme colors.
  - Global body styling.
  - Custom scrollbars.

Animations:

- `framer-motion` for:
  - Sidebar collapse/expand.
  - Chat message enter animations.
  - Sources panel slide‑in.

Markdown:

- `react-markdown`, `remark-gfm`, and `rehype-highlight` for:
  - GitHub‑style markdown rendering.
  - Inline code and fenced code block highlighting.

---

## ☁️ Deployment (Vercel)

1. Push the root repo to GitHub.
2. In Vercel, create a new project from the repo.
3. Set the **Root Directory** to `enterprise-rag/frontend`.
4. Confirm build settings (Next.js auto‑detected):
   - Install: `npm install`
   - Build: `npm run build`
5. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy.

Vercel will provide a URL like `https://your-app-name.vercel.app`. Add this URL to `CORS_ORIGINS` in the backend environment so the browser can call the API.

---

## 🧱 Possible Improvements

- Add user authentication and tie projects to Supabase users.
- Persist conversations and show a conversation list in the UI.
- Add a settings panel per project (e.g., temperature, top‑k parameters).
- Add a simple onboarding/walkthrough for new users.

If you use or extend this UI, consider starring the repository to help others find it. 🌟

