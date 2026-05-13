export function EmptyState(props: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 py-16 text-slate-500">
      <div className="w-10 h-10 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-xs">
        AI
      </div>
      <h2 className="text-sm font-semibold text-slate-200">{props.title}</h2>
      <p className="text-xs text-slate-500 max-w-sm">{props.description}</p>
    </div>
  )
}

