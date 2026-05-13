'use client'

import { Trash2 } from "lucide-react"

import { useDocuments } from "@/hooks/useDocuments"

function StatusBadge(props: { status: string; error?: string | null }) {
  const status = props.status
  let color = "bg-emerald-500"
  let label = "Ready"
  if (status === "processing") {
    color = "bg-amber-400"
    label = "Processing"
  } else if (status === "error") {
    color = "bg-red-500"
    label = "Error"
  }
  return (
    <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-surface-800 border border-white/10">
      <span className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
      <span>{label}</span>
      {status === "error" && props.error && (
        <span className="text-red-300 truncate max-w-[160px]">{props.error}</span>
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
    <div className="mt-6 rounded-xl border border-white/10 bg-surface-900/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-slate-100">Documents</h2>
        {loading && (
          <span className="text-[11px] text-slate-400">Refreshing…</span>
        )}
      </div>
      {documents.length === 0 ? (
        <div className="px-4 py-6 text-sm text-slate-500">
          No documents yet. Upload a file or ingest a URL to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-900/80 border-b border-white/10">
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Chunks</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Uploaded</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr
                  key={doc.id}
                  className="border-t border-white/5 hover:bg-surface-800/60 transition-colors"
                >
                  <td className="px-4 py-2 text-[13px] max-w-xs truncate">
                    {doc.filename}
                  </td>
                  <td className="px-4 py-2 text-[11px] uppercase text-slate-500">
                    {doc.file_type}
                  </td>
                  <td className="px-4 py-2 text-[11px]">
                    {doc.chunk_count ?? 0}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={doc.status} error={doc.error_msg} />
                  </td>
                  <td className="px-4 py-2 text-[11px] text-slate-500">
                    {new Date(doc.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => void deleteDoc(doc.id)}
                      className="inline-flex items-center justify-center rounded-md border border-red-500/40 text-red-200 hover:bg-red-500/10 px-2 py-1 text-[11px] gap-1"
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
