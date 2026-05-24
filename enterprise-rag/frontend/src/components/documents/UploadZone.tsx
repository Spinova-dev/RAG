'use client'

import { useCallback, useState } from "react"
import { Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"

type UploadStatus = "idle" | "uploading" | "success" | "error"

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
  "text/csv": [".csv"],
  "text/markdown": [".md"],
}

export function UploadZone(props: {
  projectId: string
  onUploaded?: () => void
}) {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [urlInput, setUrlInput] = useState("")
  const [urlLoading, setUrlLoading] = useState(false)

  const onDrop = useCallback(
    async (files: File[]) => {
      if (!props.projectId) return
      setStatus("uploading")
      for (const file of files) {
        const form = new FormData()
        form.append("file", file)
        form.append("project_id", props.projectId)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/documents/upload`,
          {
            method: "POST",
            body: form,
          },
        )
        if (!res.ok) {
          setStatus("error")
          return
        }
      }
      setStatus("success")
      if (props.onUploaded) props.onUploaded()
      window.setTimeout(() => setStatus("idle"), 2000)
    },
    [props],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 50 * 1024 * 1024,
  })

  const ingestUrl = async () => {
    if (!urlInput.trim() || !props.projectId) return
    setUrlLoading(true)
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/documents/ingest-url`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlInput.trim(),
          project_id: props.projectId,
        }),
      },
    )
    setUrlInput("")
    setUrlLoading(false)
    if (props.onUploaded) props.onUploaded()
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-brand border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 bg-white",
          isDragActive
            ? "border-teal bg-teal/5 scale-[1.01]"
            : "border-border hover:border-teal/50",
          status === "success" && "border-good/50 bg-good/5",
          status === "error" && "border-bad/50 bg-bad/5",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {status === "uploading" ? (
            <Loader2 className="text-teal animate-spin" size={32} />
          ) : (
            <span className="badge-pill">Upload</span>
          )}
          <div>
            <p className="text-sm font-semibold text-ink">
              {isDragActive
                ? "Drop files here"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted mt-1">
              PDF, DOCX, TXT, CSV, MD — up to 50MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          placeholder="https://example.com/article..."
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") void ingestUrl()
          }}
          className="flex-1 input-field"
        />
        <button
          type="button"
          onClick={() => void ingestUrl()}
          disabled={urlLoading || !urlInput.trim()}
          className="btn-primary shrink-0"
        >
          {urlLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Ingest"
          )}
        </button>
      </div>
    </div>
  )
}
