"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-[2rem] border border-red-900/12 bg-white/84 p-8 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-red-700">
        Dashboard error
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
        The dashboard could not be rendered.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
        This usually means the auth or database layer could not complete a
        server-side check for the current request.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
          onClick={reset}
          type="button"
        >
          Try Again
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 text-sm font-medium text-stone-950 transition hover:border-stone-400 hover:bg-stone-50"
          href="/"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
