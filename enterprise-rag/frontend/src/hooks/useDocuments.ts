import { useCallback, useEffect, useState } from "react"

interface DocumentRecord {
  id: string
  project_id: string
  filename: string
  file_type: string
  file_size: number | null
  chunk_count: number
  status: string
  error_msg?: string | null
  created_at: string
}

export function useDocuments(projectId: string) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${projectId}`,
      )
      if (!res.ok) return
      const data = (await res.json()) as DocumentRecord[]
      setDocuments(data)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const hasProcessing = documents.some(d => d.status === "processing")
    if (!hasProcessing) return
    const id = window.setInterval(() => {
      void load()
    }, 3000)
    return () => window.clearInterval(id)
  }, [documents, load])

  return { documents, loading, reload: load }
}

