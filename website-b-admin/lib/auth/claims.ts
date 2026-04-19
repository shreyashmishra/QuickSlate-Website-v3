import type { User } from "@auth0/nextjs-auth0/types";
import {
  portalRoles,
  quickSlateAuthorizationClaimKey,
  type AllowedUserRecord,
  type SessionAuthorizationClaims,
} from "@/types/auth";

export { quickSlateAuthorizationClaimKey } from "@/types/auth";

export function buildSessionAuthorizationClaims(
  allowedUser: AllowedUserRecord | null,
): SessionAuthorizationClaims {
  return {
    allowlisted: allowedUser !== null,
    allowedUserId: allowedUser?.id ?? null,
    isActive: allowedUser?.isActive ?? false,
    role: allowedUser?.role ?? null,
    syncedAt: new Date().toISOString(),
  };
}

export function readSessionAuthorizationClaims(
  user: User,
): SessionAuthorizationClaims | null {
  const value = user[quickSlateAuthorizationClaimKey];

  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const role = candidate.role;

  return {
    allowlisted: candidate.allowlisted === true,
    allowedUserId:
      typeof candidate.allowedUserId === "number" && Number.isInteger(candidate.allowedUserId)
        ? candidate.allowedUserId
        : null,
    isActive: candidate.isActive === true,
    role:
      typeof role === "string" && portalRoles.includes(role as (typeof portalRoles)[number])
        ? (role as (typeof portalRoles)[number])
        : null,
    syncedAt:
      typeof candidate.syncedAt === "string"
        ? candidate.syncedAt
        : new Date(0).toISOString(),
  };
}
