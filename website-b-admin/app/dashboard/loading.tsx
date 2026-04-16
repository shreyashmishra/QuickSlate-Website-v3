export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-[2rem] border border-stone-200 bg-white/82" />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-80 animate-pulse rounded-[1.75rem] border border-stone-200 bg-white/82" />
        <div className="h-80 animate-pulse rounded-[1.75rem] border border-stone-200 bg-white/82" />
        <div className="h-80 animate-pulse rounded-[1.75rem] border border-stone-200 bg-white/82" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-52 animate-pulse rounded-[1.75rem] border border-stone-200 bg-white/82" />
        <div className="h-52 animate-pulse rounded-[1.75rem] border border-stone-200 bg-stone-950/80" />
      </div>
    </div>
  );
}
