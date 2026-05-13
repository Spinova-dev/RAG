import type { Source } from "@/types/chat"

export function SourcePanel(props: { sources: Source[] }) {
  return (
    <aside className="h-full w-80 bg-surface-900 px-4 py-4 flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
        Sources
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {props.sources.map(source => {
          const pct = Math.round(source.similarity * 100)
          let barColor = "bg-red-500"
          if (pct >= 80) barColor = "bg-emerald-500"
          else if (pct >= 50) barColor = "bg-amber-500"
          return (
            <div
              key={source.id}
              className="rounded-lg bg-surface-800 border border-white/5 p-3 text-xs space-y-2"
            >
              <div className="flex justify-between items-center gap-2">
                <span className="font-medium text-slate-200">
                  Doc {source.document_id.slice(0, 8)}
                </span>
                <span className="text-slate-500 text-[10px]">
                  Page {source.page}
                </span>
              </div>
              <p className="text-slate-400 line-clamp-3 whitespace-pre-wrap">
                {source.content}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`${barColor} h-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {pct}%
                </span>
              </div>
            </div>
          )
        })}
        {props.sources.length === 0 && (
          <p className="text-xs text-slate-500">No sources yet.</p>
        )}
      </div>
    </aside>
  )
}

