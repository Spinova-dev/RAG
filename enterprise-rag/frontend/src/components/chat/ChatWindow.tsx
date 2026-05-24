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
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-soft">
          {messages.length === 0 ? (
            <EmptyState
              title="اسأل أي شيء عن مستنداتك"
              description="ارفع المستندات في مشاريعك، ثم ابدأ بطرح الأسئلة."
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
                  className="flex gap-2 items-center text-muted text-sm pr-2"
                >
                  <div className="w-2 h-2 rounded-full bg-teal animate-pulse-slow" />
                  جاري التفكير...
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border bg-white p-4 shadow-header">
          {cost && (
            <div className="text-xs text-muted mb-2 text-left">
              آخر استعلام: {cost.tokens} رمز · ~${cost.cost_usd.toFixed(4)}
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
            className="border-r border-border overflow-hidden flex-shrink-0 bg-white"
          >
            <SourcePanel sources={sources} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
