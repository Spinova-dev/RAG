'use client'

import { useState } from "react"
import Link from "next/link"

import { AppShell } from "@/components/layout/AppShell"
import { useProjects } from "@/hooks/useProjects"

function ProjectsClient() {
  const { projects } = useProjects()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [creating, setCreating] = useState(false)

  return (
    <main className="flex-1 h-full overflow-y-auto bg-soft">
      <div className="max-w-content mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="section-header">المشاريع</h1>
            <p className="text-sm text-muted">
              أنشئ مشروعاً، ارفع المستندات، ثم افتح المحادثة.
            </p>
          </div>
          <form
            className="card-panel px-5 py-4 flex flex-col gap-3 w-full sm:w-72"
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
                window.location.reload()
              } finally {
                setCreating(false)
              }
            }}
          >
            <h3 className="sub-header text-base">مشروع جديد</h3>
            <input
              type="text"
              placeholder="اسم المشروع"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field text-xs"
            />
            <input
              type="text"
              placeholder="الوصف (اختياري)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input-field text-xs"
            />
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="btn-primary text-xs py-2"
            >
              {creating ? "جاري الإنشاء..." : "إنشاء مشروع"}
            </button>
          </form>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-muted">
            لا توجد مشاريع بعد. استخدم النموذج أعلاه لإضافة أول مشروع.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="card-accent-orange px-5 py-4 hover:shadow-header transition-shadow"
              >
                <span className="badge-pill mb-3">مشروع</span>
                <h2 className="sub-header text-base truncate">{project.name}</h2>
                {project.description && (
                  <p className="text-xs text-muted mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <p className="text-[11px] text-muted mt-3">
                  أُنشئ في {new Date(project.created_at).toLocaleDateString("ar-EG")}
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
    <AppShell>
      <ProjectsClient />
    </AppShell>
  )
}
