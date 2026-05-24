import { ChatWindow } from "@/components/chat/ChatWindow"
import { AppShell } from "@/components/layout/AppShell"

interface Props {
  params: { projectId: string }
}

export default function ProjectChatPage({ params }: Props) {
  return (
    <AppShell>
      <main className="h-full bg-soft overflow-hidden">
        <ChatWindow projectId={params.projectId} />
      </main>
    </AppShell>
  )
}
