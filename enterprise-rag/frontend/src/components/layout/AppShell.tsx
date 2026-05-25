import { Sidebar } from "./Sidebar"

export function AppShell(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 min-h-screen overflow-hidden">
        {props.children}
      </div>
    </div>
  )
}
