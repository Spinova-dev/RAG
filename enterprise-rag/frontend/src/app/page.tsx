import Link from "next/link"

import { BrandLogo } from "@/components/layout/BrandLogo"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex items-center justify-center px-4 py-12 min-h-screen">
        <div className="w-full max-w-xl card-accent-orange px-8 py-10">
          <div className="flex flex-col items-center text-center gap-6 mb-8">
            <BrandLogo className="justify-center" />
            <div>
              <h1 className="section-header text-center border-b-0 pb-0 mb-2">
                Smart RAG Platform
              </h1>
              <p className="text-sm text-muted">
                Upload your documents and chat with them using AI — powered by
                WebMeccano.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted text-center mb-8">
            Go to the chat interface to start asking questions about your
            uploaded documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/chat" className="btn-primary text-center">
              Go to Chat
            </Link>
            <Link href="/projects" className="btn-accent text-center">
              Manage Projects
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
