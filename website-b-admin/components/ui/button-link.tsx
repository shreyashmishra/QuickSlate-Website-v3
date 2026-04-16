import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-600",
  secondary:
    "border border-stone-300 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-stone-950",
  ghost:
    "border border-stone-200 bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-stone-950",
} as const;

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary",
  ...props
}: Readonly<
  ComponentPropsWithoutRef<"a"> & {
    variant?: keyof typeof buttonVariants;
  }
>) {
  return (
    <a
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2",
        buttonVariants[variant],
        className,
      )}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}
