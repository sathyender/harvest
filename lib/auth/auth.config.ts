import type { NextAuthConfig } from "next-auth";
import type { NextRequest } from "next/server";
type AuthorizedCallback = NonNullable<NonNullable<NextAuthConfig["callbacks"]>["authorized"]>;
const authorized: AuthorizedCallback = ({ auth, request }) => {
  const path = (request as NextRequest).nextUrl.pathname;
  if (path.startsWith("/admin")) return auth?.user?.role === "ADMIN";
  if (["/account", "/cart", "/wishlist", "/checkout", "/orders"].some((route) => path === route || path.startsWith(`${route}/`))) return !!auth?.user;
  if (["/login", "/register"].includes(path)) return !auth?.user;
  return true;
};
export const authConfig = { trustHost: true, providers: [], session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, pages: { signIn: "/login" }, callbacks: { authorized } } as unknown as NextAuthConfig;
