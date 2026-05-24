import Link from "next/link"

import { BrandLogo } from "@/components/layout/BrandLogo"
import { Footer } from "@/components/layout/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl card-accent-orange px-8 py-10">
          <div className="flex flex-col items-center text-center gap-6 mb-8">
            <BrandLogo className="justify-center" />
            <div>
              <h1 className="section-header text-center border-b-0 pb-0 mb-2">
                منصة RAG الذكية
              </h1>
              <p className="text-sm text-muted">
                ارفع مستنداتك وتحدث معها باستخدام الذكاء الاصطناعي — مدعوم من{" "}
                <span className="font-brand text-brand">WebMeccano</span>
              </p>
            </div>
          </div>
          <p className="text-sm text-muted text-center mb-8">
            انتقل إلى واجهة المحادثة لبدء طرح الأسئلة على مستنداتك المرفوعة.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/chat" className="btn-primary text-center">
              الذهاب إلى المحادثة
            </Link>
            <Link
              href="/projects"
              className="btn-accent text-center"
            >
              إدارة المشاريع
            </Link>
          </div>
        </div>
      </main>
      <div className="px-4 pb-4">
        <Footer />
      </div>
    </div>
  )
}
