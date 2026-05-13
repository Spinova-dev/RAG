'use client'

import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"

import type { Message } from "@/types/chat"

export function MessageBubble(props: { message: Message }) {
  const isUser = props.message.role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl bg-brand-600 text-white px-4 py-2 text-sm shadow-lg"
            : "max-w-[80%] rounded-2xl bg-surface-800 text-slate-100 px-4 py-3 text-sm border border-white/5 shadow-md prose prose-invert prose-sm"
        }
      >
        {isUser ? (
          <p>{props.message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {props.message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}

