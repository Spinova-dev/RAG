'use client'

import { Trash2 } from "lucide-react"

import { useDocuments } from "@/hooks/useDocuments"

function StatusBadge(props: { status: string; error?: string | null }) {
  const status = props.status
  let color = "bg-good"
  let label = "جاهز"
  if (status === "processing") {
    color = "bg-warn"
    label = "قيد المعالجة"
  } else if (status === "error") {
    color = "bg-bad"
    label = "خطأ"
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
        <h2 className="sub-header text-base">المستندات</h2>
        {loading && (
          <span className="text-[11px] text-muted">جاري التحديث…</span>
        )}
      </div>
      {documents.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted">
          لا توجد مستندات بعد. ارفع ملفاً أو استورد رابطاً للبدء.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-xs text-ink">
            <thead className="bg-teal text-white">
              <tr className="text-[11px] font-black">
                <th className="px-4 py-2.5">الاسم</th>
                <th className="px-4 py-2.5">النوع</th>
                <th className="px-4 py-2.5">الأجزاء</th>
                <th className="px-4 py-2.5">الحالة</th>
                <th className="px-4 py-2.5">تاريخ الرفع</th>
                <th className="px-4 py-2.5 text-left">إجراءات</th>
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
                    {new Date(doc.created_at).toLocaleString("ar-EG")}
                  </td>
                  <td className="px-4 py-2.5 text-left">
                    <button
                      type="button"
                      onClick={() => void deleteDoc(doc.id)}
                      className="inline-flex items-center justify-center rounded-brand border border-bad/40 text-bad hover:bg-bad/5 px-2 py-1 text-[11px] gap-1"
                    >
                      <Trash2 size={12} />
                      حذف
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
