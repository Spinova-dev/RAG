import { useEffect, useState } from "react"

import type { Project } from "@/types/api"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/`,
        )
        if (!res.ok) return
        const data = (await res.json()) as Project[]
        setProjects(data)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return { projects, loading }
}
