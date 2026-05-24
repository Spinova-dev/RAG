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
            ? "max-w-[80%] rounded-brand bg-brand text-white px-4 py-2.5 text-sm shadow-badge"
            : "max-w-[80%] rounded-brand bg-white text-ink px-4 py-3 text-sm border border-border shadow-card border-l-[5px] border-l-teal prose prose-sm max-w-none"
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
