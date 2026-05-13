import Link from "next/link"

import { DocumentList } from "@/components/documents/DocumentList"
import { UploadZone } from "@/components/documents/UploadZone"
import { Sidebar } from "@/components/layout/Sidebar"

interface Props {
  params: { projectId: string }
}

function ProjectDocumentsClient({ projectId }: { projectId: string }) {
  return (
    <main className="flex-1 h-screen bg-[var(--bg-primary)] text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Project documents</h1>
            <p className="text-sm text-slate-400">
              Upload files or ingest URLs, then open chat for this project.
            </p>
          </div>
          <Link
            href={`/chat/${projectId}`}
            className="text-sm text-brand-400 hover:text-brand-300"
          >
            Open chat
          </Link>
        </div>
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-100">Upload</h2>
          <UploadZone projectId={projectId} />
        </section>
        <DocumentList projectId={projectId} />
      </div>
    </main>
  )
}

export default function ProjectDocumentsPage({ params }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <ProjectDocumentsClient projectId={params.projectId} />
    </div>
  )
}
