import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Gates the whole site — `/`, `/flow/*`, `/admin/*` — behind sign-in; only
 * `/login`, the NextAuth routes, and the unauthenticated approve-access link
 * (see app/api/approve-access/route.ts) stay open. See docs/AUTH.md.
 *
 * Next 16's build-time static analyzer rejects the destructured Auth.js v5
 * form (`export const { auth: proxy } = NextAuth(...)`) as "not a function",
 * so destructure into a local binding and re-export as default.
 */
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: [
    "/((?!login|api/auth|api/approve-access|_next/static|_next/image|favicon\\.ico|.*\\..*).*)",
  ],
};
