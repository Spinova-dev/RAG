export function EmptyState(props: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-16">
      <span className="badge-pill text-base px-4 py-1.5">AI</span>
      <h2 className="section-header border-b-0 pb-0 text-lg">{props.title}</h2>
      <p className="text-xs text-muted max-w-sm">{props.description}</p>
    </div>
  )
}
