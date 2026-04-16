import { getAuth0Client } from "./lib/auth0";

export async function proxy(request: Request) {
  return getAuth0Client().middleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
