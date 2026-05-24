import type { Source } from "@/types/chat"

export function SourcePanel(props: { sources: Source[] }) {
  return (
    <aside className="h-full w-80 bg-white px-4 py-4 flex flex-col gap-3">
      <h3 className="sub-header text-sm">المصادر</h3>
      <div className="flex-1 overflow-y-auto space-y-3 pl-1">
        {props.sources.map(source => {
          const pct = Math.round(source.similarity * 100)
          let barColor = "bg-bad"
          if (pct >= 80) barColor = "bg-good"
          else if (pct >= 50) barColor = "bg-warn"
          return (
            <div
              key={source.id}
              className="card-accent-orange p-3 text-xs space-y-2"
            >
              <div className="flex justify-between items-center gap-2">
                <span className="font-black text-ink">
                  مستند {source.document_id.slice(0, 8)}
                </span>
                <span className="text-muted text-[10px]">
                  صفحة {source.page}
                </span>
              </div>
              <p className="text-muted line-clamp-3 whitespace-pre-wrap">
                {source.content}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-pill bg-soft overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-pill`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted shrink-0">
                  {pct}%
                </span>
              </div>
            </div>
          )
        })}
        {props.sources.length === 0 && (
          <p className="text-xs text-muted">لا توجد مصادر بعد.</p>
        )}
      </div>
    </aside>
  )
}
