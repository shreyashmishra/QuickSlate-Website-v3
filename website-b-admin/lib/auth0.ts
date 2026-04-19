import "server-only";

import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { findAllowedUserByEmail } from "@/lib/allowlist";
import {
  buildSessionAuthorizationClaims,
  quickSlateAuthorizationClaimKey,
} from "@/lib/auth/claims";
import { getServerEnv } from "@/lib/server-env";

declare global {
  var __quickSlateAuth0Client: Auth0Client | undefined;
}

export function getAuth0Client() {
  if (!globalThis.__quickSlateAuth0Client) {
    const env = getServerEnv();

    globalThis.__quickSlateAuth0Client = new Auth0Client({
      appBaseUrl: env.APP_BASE_URL,
      authorizationParameters: {
        scope: "openid profile email",
      },
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      domain: env.AUTH0_DOMAIN,
      beforeSessionSaved: async (session) => {
        const email =
          typeof session.user.email === "string"
            ? session.user.email.trim().toLowerCase()
            : null;
        const allowedUser = email ? await findAllowedUserByEmail(email) : null;

        return {
          ...session,
          user: {
            ...session.user,
            [quickSlateAuthorizationClaimKey]: buildSessionAuthorizationClaims(
              allowedUser,
            ),
          },
        };
      },
      secret: env.AUTH0_SECRET,
      session: {
        absoluteDuration: 60 * 60 * 8,
        inactivityDuration: 60 * 60 * 2,
        rolling: true,
      },
      signInReturnToPath: "/dashboard",
    });
  }

  return globalThis.__quickSlateAuth0Client;
}
