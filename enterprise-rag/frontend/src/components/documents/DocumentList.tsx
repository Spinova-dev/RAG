'use client'

import { Trash2 } from "lucide-react"

import { useDocuments } from "@/hooks/useDocuments"

function StatusBadge(props: { status: string; error?: string | null }) {
  const status = props.status
  let color = "bg-good"
  let label = "Ready"
  if (status === "processing") {
    color = "bg-warn"
    label = "Processing"
  } else if (status === "error") {
    color = "bg-bad"
    label = "Error"
  }
  return (
    <div className="inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-[10px] font-black bg-soft border border-border">
      <span className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
      <span className="text-ink">{label}</span>
      {status === "error" && props.error && (
        <span className="text-bad truncate max-w-[160px]">{props.error}</span>
      )}
    </div>
  )
}

export function DocumentList(props: { projectId: string }) {
  const { documents, loading, reload } = useDocuments(props.projectId)

  const deleteDoc = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${id}`,
      { method: "DELETE" },
    )
    await reload()
  }

  if (!props.projectId) {
    return null
  }

  return (
    <div className="card-panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="sub-header text-base">Documents</h2>
        {loading && (
          <span className="text-[11px] text-muted">Refreshing…</span>
        )}
      </div>
      {documents.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted">
          No documents yet. Upload a file or ingest a URL to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-ink">
            <thead className="bg-teal text-white">
              <tr className="text-[11px] font-black">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Chunks</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Uploaded</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr
                  key={doc.id}
                  className="border-t border-border hover:bg-soft/80 transition-colors"
                >
                  <td className="px-4 py-2.5 text-[13px] max-w-xs truncate font-medium">
                    {doc.filename}
                  </td>
                  <td className="px-4 py-2.5 text-[11px] uppercase text-muted">
                    {doc.file_type}
                  </td>
                  <td className="px-4 py-2.5 text-[11px]">
                    {doc.chunk_count ?? 0}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={doc.status} error={doc.error_msg} />
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-muted">
                    {new Date(doc.created_at).toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => void deleteDoc(doc.id)}
                      className="inline-flex items-center justify-center rounded-brand border border-bad/40 text-bad hover:bg-bad/5 px-2 py-1 text-[11px] gap-1"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
