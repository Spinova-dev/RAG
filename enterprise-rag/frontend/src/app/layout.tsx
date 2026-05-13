import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Enterprise RAG Platform",
  description: "Chat with your documents using an enterprise-grade RAG stack",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {props.children}
      </body>
    </html>
  )
}

