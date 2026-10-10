import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/cart/:path*", "/wishlist/:path*", "/checkout/:path*", "/orders/:path*", "/login", "/register"],
};
