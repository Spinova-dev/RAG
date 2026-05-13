import { ChatWindow } from "@/components/chat/ChatWindow"
import { Sidebar } from "@/components/layout/Sidebar"

interface Props {
  params: { projectId: string }
}

export default function ProjectChatPage({ params }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 h-screen bg-[var(--bg-primary)]">
        <ChatWindow projectId={params.projectId} />
      </main>
    </div>
  )
}

