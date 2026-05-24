export function Footer() {
  return (
    <footer className="mt-auto bg-brand text-white rounded-brand mx-4 mb-4 px-6 py-4 shadow-header">
      <div className="max-w-content mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="font-medium">© 2026 WebMeccano. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://webmeccano.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline opacity-90 hover:opacity-100"
          >
            webmeccano.com
          </a>
          <a
            href="https://wa.me/201141104284"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-whatsapp hover:underline"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}
