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
          "relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-brand-500 bg-brand-600/10 scale-[1.01]"
            : "border-white/10 hover:border-white/20",
          status === "success" && "border-emerald-500/50 bg-emerald-500/5",
          status === "error" && "border-red-500/50 bg-red-500/5",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {status === "uploading" ? (
            <Loader2 className="text-brand-400 animate-spin" size={32} />
          ) : (
            <div className="w-8 h-8 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-xs text-slate-400">
              DOC
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-200">
              {isDragActive ? "Drop files here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
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
          className="flex-1 rounded-lg bg-surface-800 border border-white/10 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none glow-border"
        />
        <button
          type="button"
          onClick={() => void ingestUrl()}
          disabled={urlLoading || !urlInput.trim()}
          className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-sm text-white"
        >
          {urlLoading ? <Loader2 size={16} className="animate-spin" /> : "Ingest"}
        </button>
      </div>
    </div>
  )
}

