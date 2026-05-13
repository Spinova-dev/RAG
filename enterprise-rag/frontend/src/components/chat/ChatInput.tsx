'use client'

import { useState } from "react"
import { Send } from "lucide-react"

export function ChatInput(props: {
  onSend: (value: string) => Promise<void> | void
  disabled?: boolean
}) {
  const [value, setValue] = useState("")

  const submit = async () => {
    const trimmed = value.trim()
    if (!trimmed || props.disabled) return
    await props.onSend(trimmed)
    setValue("")
  }

  return (
    <div className="relative flex items-end gap-2">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            void submit()
          }
        }}
        rows={2}
        placeholder="Ask anything about your documents..."
        className="flex-1 resize-none bg-surface-800 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none glow-border"
      />
      <button
        type="button"
        onClick={() => void submit()}
        disabled={props.disabled}
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition-colors"
      >
        <Send size={16} />
      </button>
    </div>
  )
}

