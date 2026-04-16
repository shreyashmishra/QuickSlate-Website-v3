import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { getCurrentAccessState } from "@/lib/auth/session";
import { portalModules, roleDescriptions } from "@/lib/constants";

export default async function Home() {
  await connection();

  const accessState = await getCurrentAccessState();
  const isAllowed = accessState.kind === "authorized";
  const isDenied = accessState.kind === "unauthorized";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
      <header className="flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white/70 px-6 py-5 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-emerald-700">
            Website B / Phase 3
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
            QuickSlate Admin Portal
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={isAllowed ? "accent" : isDenied ? "danger" : "neutral"}>
            {isAllowed
              ? "Access granted"
              : isDenied
                ? "Access blocked"
                : "Not signed in"}
          </Badge>
          {accessState.kind === "anonymous" ? (
            <ButtonLink href="/auth/login?returnTo=%2Fdashboard" variant="primary">
              Log In with Auth0
            </ButtonLink>
          ) : (
            <ButtonLink href="/auth/logout" variant="secondary">
              Log Out
            </ButtonLink>
          )}
        </div>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white/78 p-8 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-600">
              Image management
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Upload and manage images for QuickSlate.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              Sign in to upload images, manage the library, and control what
              shows up on the Website A carousel. Only approved accounts can
              access the dashboard.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {accessState.kind === "anonymous" ? (
              <>
                <ButtonLink href="/auth/login?returnTo=%2Fdashboard" variant="primary">
                  Enter Portal
                </ButtonLink>
                <ButtonLink href="#platform-scope" variant="ghost">
                  See what&apos;s available
                </ButtonLink>
              </>
            ) : isAllowed ? (
              <>
                <ButtonLink href="/dashboard" variant="primary">
                  Open Dashboard
                </ButtonLink>
                <ButtonLink href="/auth/logout" variant="secondary">
                  Log Out
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink href="/unauthorized" variant="primary">
                  View Access Status
                </ButtonLink>
                <ButtonLink href="/auth/logout" variant="secondary">
                  Sign Out
                </ButtonLink>
              </>
            )}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-stone-200 bg-stone-950 px-6 py-7 text-stone-50 shadow-[0_24px_80px_rgba(24,33,28,0.16)]">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-300">
            Current session
          </p>
          {accessState.kind === "anonymous" ? (
            <div className="mt-5 space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight">
                Not signed in
              </h3>
              <p className="text-sm leading-7 text-stone-300">
                Sign in with your QuickSlate account to continue. You&apos;ll
                also need an approved account to access the dashboard.
              </p>
            </div>
          ) : accessState.kind === "authorized" ? (
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {accessState.user.name}
                </h3>
                <p className="mt-2 font-mono text-sm text-stone-300">
                  {accessState.user.email}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-300">
                  Role
                </p>
                <p className="mt-3 text-lg font-medium capitalize">
                  {accessState.user.role}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  {roleDescriptions[accessState.user.role]}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Access blocked
                </h3>
                <p className="mt-2 font-mono text-sm text-stone-300">
                  {accessState.sessionUser.email ?? "No email in profile"}
                </p>
              </div>
              <p className="text-sm leading-7 text-stone-300">
                You&apos;re signed in, but this account hasn&apos;t been
                approved yet. Contact an admin to get access.
              </p>
            </div>
          )}
        </aside>
      </section>

      <section
        id="platform-scope"
        className="mt-8 grid gap-4 rounded-[2rem] border border-stone-200 bg-white/74 p-6 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur lg:grid-cols-3"
      >
        {portalModules.map((module) => (
          <article
            key={module.title}
            className="rounded-[1.5rem] border border-stone-200 bg-stone-50/95 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-stone-950">
                {module.title}
              </h3>
              <Badge tone="warning">{module.status}</Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              {module.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
