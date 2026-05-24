import Link from "next/link"

import { DocumentList } from "@/components/documents/DocumentList"
import { UploadZone } from "@/components/documents/UploadZone"
import { AppShell } from "@/components/layout/AppShell"

interface Props {
  params: { projectId: string }
}

function ProjectDocumentsClient({ projectId }: { projectId: string }) {
  return (
    <main className="flex-1 h-full overflow-y-auto bg-soft">
      <div className="max-w-content mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="section-header">مستندات المشروع</h1>
            <p className="text-sm text-muted mt-1">
              ارفع الملفات أو أضف روابط، ثم افتح المحادثة لهذا المشروع.
            </p>
          </div>
          <Link href={`/chat/${projectId}`} className="btn-primary text-sm">
            فتح المحادثة
          </Link>
        </div>
        <section className="space-y-4">
          <h2 className="sub-header">رفع المستندات</h2>
          <UploadZone projectId={projectId} />
        </section>
        <DocumentList projectId={projectId} />
      </div>
    </main>
  )
}

export default function ProjectDocumentsPage({ params }: Props) {
  return (
    <AppShell>
      <ProjectDocumentsClient projectId={params.projectId} />
    </AppShell>
  )
}
