'use client'

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { useChat } from "@/hooks/useChat"
import { EmptyState } from "@/components/shared/EmptyState"

import { ChatInput } from "./ChatInput"
import { MessageBubble } from "./MessageBubble"
import { SourcePanel } from "./SourcePanel"

export function ChatWindow(props: { projectId: string }) {
  const { messages, sources, isStreaming, sendMessage, cost } = useChat(
    props.projectId,
  )
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [showSources] = useState(true)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming])

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <EmptyState
              title="Ask anything about your documents"
              description="Upload documents in your projects, then start asking questions."
            />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageBubble message={msg} />
                </motion.div>
              ))}
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center text-slate-400 text-sm pl-2"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
                  Thinking...
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/5 bg-surface-900/50 backdrop-blur p-4">
          {cost && (
            <div className="text-xs text-slate-500 mb-2 text-right">
              Last query: {cost.tokens} tokens · ~${cost.cost_usd.toFixed(4)}
            </div>
          )}
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>

      <AnimatePresence>
        {showSources && sources.length > 0 && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-white/5 overflow-hidden flex-shrink-0"
          >
            <SourcePanel sources={sources} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

