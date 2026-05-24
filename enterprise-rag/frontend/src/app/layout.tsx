import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WebMeccano RAG | Enterprise AI Platform",
  description:
    "WebMeccano RAG platform — chat with your documents using AI",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{props.children}</body>
    </html>
  )
}
