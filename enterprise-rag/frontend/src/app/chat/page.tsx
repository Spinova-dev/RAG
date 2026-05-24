import Link from "next/link"

import { AppShell } from "@/components/layout/AppShell"

export default function ChatPage() {
  return (
    <AppShell>
      <main className="h-full bg-soft flex items-center justify-center p-6">
        <div className="card-accent-teal px-8 py-10 max-w-md text-center space-y-4">
          <h1 className="section-header border-b-0 pb-0">اختر مشروعاً</h1>
          <p className="text-sm text-muted">
            اختر مشروعاً من القائمة الجانبية لفتح المحادثة والمستندات الخاصة به.
          </p>
          <p className="text-xs text-muted">
            إذا لم يكن لديك مشروع بعد، أنشئ واحداً أولاً.
          </p>
          <Link href="/projects" className="btn-primary">
            الذهاب إلى المشاريع
          </Link>
        </div>
      </main>
    </AppShell>
  )
}
