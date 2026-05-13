import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1e293b_0,_#020617_55%)]">
      <div className="max-w-xl w-full px-6 py-8 rounded-2xl bg-surface-900/80 border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-semibold">
            RP
          </div>
          <div>
            <h1 className="text-lg font-semibold">Enterprise RAG Platform</h1>
            <p className="text-sm text-slate-400">
              Upload documents, then chat with them using GPT-4o.
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Continue to the chat interface to start asking questions about your
          uploaded documents.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-sm font-medium text-white transition-colors"
        >
          Go to Chat
        </Link>
      </div>
    </main>
  )
}

