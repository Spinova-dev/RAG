import { cn } from "@/lib/utils"

export function BrandLogo(props: { className?: string }) {
  return (
    <div className={cn("flex items-center", props.className)}>
      <img
        src="https://webmeccano.com/_next/static/media/wm-logo-300x90.e76ce20f.png"
        alt="WebMeccano"
        height={54}
        className="h-[54px] w-auto"
      />
    </div>
  )
}
