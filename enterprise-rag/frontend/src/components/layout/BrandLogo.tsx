import { cn } from "@/lib/utils"

export function BrandLogo(props: { collapsed?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", props.className)}>
      <img
        src="https://webmeccano.com/_next/static/media/wm-logo-300x90.e76ce20f.png"
        alt="WebMeccano"
        height={54}
        className="h-[54px] w-auto"
      />
      {!props.collapsed && (
        <span className="font-brand text-brand text-sm hidden sm:inline">
          WebMeccano
        </span>
      )}
    </div>
  )
}
