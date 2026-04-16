import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { getCurrentAccessState } from "@/lib/auth/session";

export default async function UnauthorizedPage() {
  await connection();

  const accessState = await getCurrentAccessState();

  if (accessState.kind === "authorized") {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10 sm:px-10">
      <section className="w-full rounded-[2.25rem] border border-stone-200 bg-white/82 p-8 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur sm:p-10">
        <Badge tone="danger">Access denied</Badge>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-950">
          This account cannot open the dashboard.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600">
          Dashboard access requires a valid Auth0 session plus a matching active
          entry in the PostgreSQL allowlist. Accounts that are missing,
          inactive, or missing an email claim are blocked on the server before
          the portal renders.
        </p>

        <div className="mt-8 rounded-[1.75rem] border border-stone-200 bg-stone-50/90 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-600">
            Session state
          </p>
          <p className="mt-4 text-lg font-medium text-stone-950">
            {accessState.kind === "anonymous"
              ? "No active session"
              : accessState.sessionUser.email ?? "Signed in without an email claim"}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Only the seeded admin account is allowlisted in this phase:
            <span className="ml-2 font-mono text-stone-950">
              shreyashmishra2016@gmail.com
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {accessState.kind === "anonymous" ? (
            <ButtonLink href="/auth/login?returnTo=%2Fdashboard" variant="primary">
              Log In
            </ButtonLink>
          ) : (
            <ButtonLink href="/auth/logout" variant="primary">
              Log Out
            </ButtonLink>
          )}
          <ButtonLink href="/" variant="secondary">
            Return Home
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
