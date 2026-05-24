import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WebMeccano RAG | منصة الذكاء الاصطناعي",
  description:
    "منصة RAG من WebMeccano — تحدث مع مستنداتك باستخدام الذكاء الاصطناعي",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{props.children}</body>
    </html>
  )
}
