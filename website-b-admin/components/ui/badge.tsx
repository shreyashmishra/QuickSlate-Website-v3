import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const badgeToneClasses = {
  accent: "bg-emerald-100 text-emerald-800 ring-emerald-900/10",
  warning: "bg-amber-100 text-amber-800 ring-amber-900/10",
  danger: "bg-rose-100 text-rose-800 ring-rose-900/10",
  neutral: "bg-stone-200/90 text-stone-700 ring-stone-900/10",
} as const;

export function Badge({
  children,
  className,
  tone = "neutral",
}: Readonly<{
  children: ReactNode;
  className?: string;
  tone?: keyof typeof badgeToneClasses;
}>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] ring-1",
        badgeToneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
