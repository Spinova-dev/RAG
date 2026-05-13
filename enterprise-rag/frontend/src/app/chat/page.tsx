import Link from "next/link"

import { Sidebar } from "@/components/layout/Sidebar"

export default function ChatPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 h-screen bg-[var(--bg-primary)] text-slate-300 flex items-center justify-center">
        <div className="px-6 py-8 rounded-2xl bg-surface-900 border border-white/10 max-w-md text-center space-y-4">
          <h1 className="text-lg font-semibold">Select a project</h1>
          <p className="text-sm text-slate-400">
            Choose a project from the sidebar to open its dedicated chat and
            documents.
          </p>
          <p className="text-xs text-slate-500">
            If you do not have a project yet, create one first.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 hover:bg-brand-700 text-sm text-white px-4 py-2 transition-colors"
          >
            Go to Projects
          </Link>
        </div>
      </main>
    </div>
  )
}
