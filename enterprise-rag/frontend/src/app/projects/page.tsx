'use client'

import { useState } from "react"
import Link from "next/link"

import { Sidebar } from "@/components/layout/Sidebar"
import { useProjects } from "@/hooks/useProjects"

function ProjectsClient() {
  const { projects, loading } = useProjects()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [creating, setCreating] = useState(false)

  return (
    <main className="flex-1 h-screen bg-[var(--bg-primary)] text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Projects</h1>
            <p className="text-sm text-slate-400">
              Create a project, upload documents, then open its chat.
            </p>
          </div>
          <form
            className="rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 flex flex-col gap-2 w-64"
            onSubmit={async e => {
              e.preventDefault()
              if (!name.trim()) return
              setCreating(true)
              try {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/projects/`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: name.trim(),
                      description: description.trim() || null,
                    }),
                  },
                )
                if (!res.ok) {
                  console.error("Failed to create project", await res.text())
                  return
                }
                setName("")
                setDescription("")
                // simple reload of page data
                window.location.reload()
              } finally {
                setCreating(false)
              }
            }}
          >
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg bg-surface-800 border border-white/10 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none glow-border"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-lg bg-surface-800 border border-white/10 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none glow-border"
            />
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-xs text-white px-3 py-1.5"
            >
              {creating ? "Creating..." : "New project"}
            </button>
          </form>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">
            No projects yet. Use the form above to add your first project.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 hover:border-brand-500/60 hover:bg-surface-800/80 transition-colors"
              >
                <h2 className="text-sm font-semibold truncate">
                  {project.name}
                </h2>
                {project.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-2">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <ProjectsClient />
    </div>
  )
}
