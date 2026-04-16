export default function RootLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 sm:px-10 lg:px-12">
      <div className="h-24 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70" />
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
        <div className="h-96 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70" />
        <div className="h-96 animate-pulse rounded-[2rem] border border-stone-200 bg-stone-950/80" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-44 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70" />
        <div className="h-44 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70" />
        <div className="h-44 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70" />
      </div>
    </main>
  );
}
