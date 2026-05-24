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
        placeholder="اسأل أي شيء عن مستنداتك..."
        className="flex-1 resize-none input-field py-2.5"
      />
      <button
        type="button"
        onClick={() => void submit()}
        disabled={props.disabled}
        className="inline-flex items-center justify-center w-11 h-11 rounded-brand btn-accent p-0 disabled:opacity-50"
        aria-label="إرسال"
      >
        <Send size={16} className="rotate-180" />
      </button>
    </div>
  )
}
