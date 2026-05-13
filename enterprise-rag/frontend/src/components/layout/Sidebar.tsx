'use client'

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, FolderOpen, Plus, Settings, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useProjects } from "@/hooks/useProjects"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { projects } = useProjects()
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative h-screen bg-surface-900 border-r border-white/5 flex flex-col overflow-hidden flex-shrink-0"
    >
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">RAG Platform</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className={cn(
            "ml-auto p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors",
            collapsed && "mx-auto",
          )}
        >
          <ChevronLeft
            size={16}
            className={cn(
              "transition-transform",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      <div className="p-3">
        <Link
          href="/chat"
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all group",
            collapsed && "justify-center",
          )}
        >
          <Plus size={16} />
          {!collapsed && <span>New Chat</span>}
        </Link>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
          <p className="text-xs font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider mt-2">
            Projects
          </p>
          <AnimatePresence initial={false}>
            {projects.map(project => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                <Link
                  href={`/chat/${project.id}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all group",
                    pathname.includes(project.id) &&
                      "bg-brand-600/10 text-brand-400 border border-brand-600/20",
                  )}
                >
                  <FolderOpen size={14} />
                  <span className="truncate">{project.name}</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="p-3 border-t border-white/5 space-y-0.5">
        {[
          { href: "/projects", icon: FolderOpen, label: "Projects" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all",
              collapsed && "justify-center",
            )}
          >
            <item.icon size={16} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </motion.aside>
  )
}

