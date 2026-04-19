export const portalRoles = ["uploader", "admin"] as const;
export const quickSlateAuthorizationClaimKey = "quickSlateAuthorization" as const;

export type PortalRole = (typeof portalRoles)[number];

export type SessionUserSnapshot = {
  email: string | null;
  name: string;
  picture: string | null;
  sub: string;
};

export type SessionAuthorizationClaims = {
  allowlisted: boolean;
  allowedUserId: number | null;
  isActive: boolean;
  role: PortalRole | null;
  syncedAt: string;
};

export type AllowedUserRecord = {
  createdAt: Date;
  email: string;
  id: number;
  isActive: boolean;
  role: PortalRole;
  updatedAt: Date;
};

export type AuthorizedPortalUser = {
  allowedUserId: number;
  email: string;
  isActive: true;
  name: string;
  picture: string | null;
  role: PortalRole;
  sub: string;
};

export type AccessState =
  | { kind: "anonymous" }
  | {
      kind: "unauthorized";
      reason: "inactive" | "missing-email" | "not-allowlisted" | "session-stale";
      sessionUser: SessionUserSnapshot;
    }
  | {
      kind: "authorized";
      user: AuthorizedPortalUser;
    };
