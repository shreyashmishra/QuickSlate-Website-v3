import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import type { AuthorizedPortalUser } from "@/types/auth";

export function DashboardShell({
  children,
  user,
}: Readonly<{
  children: ReactNode;
  user: AuthorizedPortalUser;
}>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 sm:px-10 lg:px-12">
      <header className="rounded-[2rem] border border-stone-200 bg-white/78 p-6 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-stone-600">
              QuickSlate / Website B
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent">Authorized</Badge>
            <ButtonLink href="/" variant="ghost">
              Landing Page
            </ButtonLink>
            <ButtonLink href="/auth/logout" variant="secondary">
              Log Out
            </ButtonLink>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-stone-200 bg-stone-950 p-6 text-stone-50 shadow-[0_24px_80px_rgba(24,33,28,0.16)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold uppercase">
            {user.name.slice(0, 2)}
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight">
            {user.name}
          </h2>
          <p className="mt-2 font-mono text-sm text-stone-300">{user.email}</p>

          <div className="mt-8 space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-300">
                Role
              </p>
              <p className="mt-2 text-lg font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-300">
                Status
              </p>
              <p className="mt-2 text-lg font-medium">Active</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-300">
                Auth subject
              </p>
              <p className="mt-2 break-all font-mono text-xs leading-6 text-stone-300">
                {user.sub}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-300">
              What&apos;s available
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Upload images, edit metadata, and manage the carousel feed. This
              portal is separate from the main Website A.
            </p>
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </main>
  );
}
