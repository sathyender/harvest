import type { NextAuthConfig } from "next-auth";
import type { NextRequest } from "next/server";
type AuthorizedCallback = NonNullable<NonNullable<NextAuthConfig["callbacks"]>["authorized"]>;
const authorized: AuthorizedCallback = ({ auth, request }) => {
  const path = (request as NextRequest).nextUrl.pathname;
  if (["/login", "/register", "/forgot-password", "/api/health/db"].includes(path)) return true;
  if (!auth?.user) return false;
  if (path.startsWith("/admin")) return auth.user.role === "ADMIN";
  return true;
};
export const authConfig = { trustHost: true, providers: [], session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, pages: { signIn: "/login" }, callbacks: { authorized } } as unknown as NextAuthConfig;