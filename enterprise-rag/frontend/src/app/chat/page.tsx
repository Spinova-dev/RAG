import Link from "next/link"

import { AppShell } from "@/components/layout/AppShell"

export default function ChatPage() {
  return (
    <AppShell>
      <main className="h-full bg-soft flex items-center justify-center p-6">
        <div className="card-accent-teal px-8 py-10 max-w-md text-center space-y-4">
          <h1 className="section-header border-b-0 pb-0">Select a project</h1>
          <p className="text-sm text-muted">
            Choose a project from the sidebar to open its chat and documents.
          </p>
          <p className="text-xs text-muted">
            If you do not have a project yet, create one first.
          </p>
          <Link href="/projects" className="btn-primary">
            Go to Projects
          </Link>
        </div>
      </main>
    </AppShell>
  )
}
