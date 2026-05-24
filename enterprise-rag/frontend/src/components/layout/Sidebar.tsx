'use client'

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, FolderOpen, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useProjects } from "@/hooks/useProjects"
import { cn } from "@/lib/utils"

import { BrandLogo } from "./BrandLogo"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { projects } = useProjects()
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative h-screen bg-white border-l border-border flex flex-col overflow-hidden flex-shrink-0 shadow-header"
    >
      <div className="h-[72px] flex items-center px-3 border-b border-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 min-w-0"
          >
            <BrandLogo />
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className={cn(
            "p-1.5 rounded-brand text-muted hover:text-ink hover:bg-soft transition-colors",
            collapsed && "mx-auto",
          )}
          aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          <ChevronRight
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
            "btn-primary w-full gap-2",
            collapsed && "justify-center px-2",
          )}
        >
          <Plus size={16} />
          {!collapsed && <span>محادثة جديدة</span>}
        </Link>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
          <p className="text-xs font-black text-muted px-2 py-1 uppercase tracking-wider mt-2">
            المشاريع
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
                    "flex items-center gap-2 px-3 py-2 rounded-brand text-sm text-muted hover:text-ink hover:bg-soft transition-all",
                    pathname.includes(project.id) &&
                      "bg-teal/10 text-teal border border-teal/25 font-semibold",
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

      <div className="p-3 border-t border-border space-y-0.5">
        {[
          { href: "/projects", icon: FolderOpen, label: "المشاريع" },
          { href: "/projects", icon: Settings, label: "الإعدادات" },
        ].map((item, i) => (
          <Link
            key={`${item.href}-${i}`}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-brand text-sm text-muted hover:text-ink hover:bg-soft transition-all",
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
