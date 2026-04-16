import "server-only";

import { redirect } from "next/navigation";
import { HttpError } from "@/lib/api/http";
import { findAllowedUserByEmail } from "@/lib/allowlist";
import { getAuth0Client } from "@/lib/auth0";
import type {
  AccessState,
  AuthorizedPortalUser,
  SessionUserSnapshot,
} from "@/types/auth";

export type { AuthorizedPortalUser } from "@/types/auth";

function normalizeEmail(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}

function getDisplayName(user: Record<string, unknown>, email: string | null) {
  const name = typeof user.name === "string" ? user.name.trim() : "";
  if (name) {
    return name;
  }

  const nickname = typeof user.nickname === "string" ? user.nickname.trim() : "";
  if (nickname) {
    return nickname;
  }

  return email ? email.split("@")[0] : "Authenticated user";
}

export async function getSessionUserSnapshot(): Promise<SessionUserSnapshot | null> {
  const session = await getAuth0Client().getSession();

  if (!session?.user) {
    return null;
  }

  const email = normalizeEmail(
    typeof session.user.email === "string" ? session.user.email : null,
  );

  return {
    email,
    name: getDisplayName(session.user, email),
    picture:
      typeof session.user.picture === "string" ? session.user.picture : null,
    sub: typeof session.user.sub === "string" ? session.user.sub : "unknown",
  };
}

export async function getCurrentAccessState(): Promise<AccessState> {
  const sessionUser = await getSessionUserSnapshot();

  if (!sessionUser) {
    return { kind: "anonymous" };
  }

  if (!sessionUser.email) {
    return {
      kind: "unauthorized",
      reason: "missing-email",
      sessionUser,
    };
  }

  const allowedUser = await findAllowedUserByEmail(sessionUser.email);

  if (!allowedUser) {
    return {
      kind: "unauthorized",
      reason: "not-allowlisted",
      sessionUser,
    };
  }

  if (!allowedUser.isActive) {
    return {
      kind: "unauthorized",
      reason: "inactive",
      sessionUser,
    };
  }

  const user: AuthorizedPortalUser = {
    allowedUserId: allowedUser.id,
    email: allowedUser.email,
    isActive: true,
    name: sessionUser.name,
    picture: sessionUser.picture,
    role: allowedUser.role,
    sub: sessionUser.sub,
  };

  return {
    kind: "authorized",
    user,
  };
}

export async function requireAuthorizedUser(): Promise<AuthorizedPortalUser> {
  const accessState = await getCurrentAccessState();

  if (accessState.kind === "anonymous") {
    redirect("/auth/login?returnTo=%2Fdashboard");
  }

  if (accessState.kind === "unauthorized") {
    redirect("/unauthorized");
  }

  return accessState.user;
}

export async function requireApiAuthorizedUser(): Promise<AuthorizedPortalUser> {
  const accessState = await getCurrentAccessState();

  if (accessState.kind === "anonymous") {
    throw new HttpError(401, "unauthenticated", "Authentication is required.");
  }

  if (accessState.kind === "unauthorized") {
    throw new HttpError(
      403,
      "forbidden",
      "You are not allowed to access this resource.",
      { reason: accessState.reason },
    );
  }

  return accessState.user;
}

export function isAdmin(user: AuthorizedPortalUser) {
  return user.role === "admin";
}

export function hasRole(
  user: AuthorizedPortalUser,
  role: AuthorizedPortalUser["role"],
) {
  return user.role === role;
}
