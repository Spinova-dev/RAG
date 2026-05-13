import { useCallback, useState } from "react"

import type { CostInfo, Message, Source } from "@/types/chat"

export function useChat(projectId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [cost, setCost] = useState<CostInfo | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isStreaming) return

      const userMsg: Message = { role: "user", content: question }
      const assistantMsg: Message = { role: "assistant", content: "" }
      setMessages(prev => [...prev, userMsg, assistantMsg])
      setSources([])
      setIsStreaming(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            project_id: projectId,
            history: messages
              .slice(-6)
              .map(m => ({ role: m.role, content: m.content })),
          }),
        },
      )

      const reader = response.body?.getReader()
      if (!reader) {
        setIsStreaming(false)
        return
      }

      const decoder = new TextDecoder()
      let buffer = ""

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const event = JSON.parse(line.slice(6)) as {
              type: "chunk" | "sources" | "cost" | "done"
              content?: string
              sources?: Source[]
              tokens?: number
              cost_usd?: number
            }
            if (event.type === "chunk" && event.content) {
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + event.content,
                }
                return updated
              })
            } else if (event.type === "sources" && event.sources) {
              setSources(event.sources)
            } else if (
              event.type === "cost" &&
              typeof event.tokens === "number" &&
              typeof event.cost_usd === "number"
            ) {
              setCost({ tokens: event.tokens, cost_usd: event.cost_usd })
            }
          } catch {
          }
        }
      }
      setIsStreaming(false)
    },
    [messages, isStreaming, projectId],
  )

  return { messages, sources, cost, isStreaming, sendMessage }
}

