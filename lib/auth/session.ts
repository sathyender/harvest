import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "@/lib/db/client";
export async function getCurrentUser() { const session=await auth(); if (!session?.user?.id) return null; return db.user.findUnique({ where:{id:session.user.id} }); }
export async function requireUser(callbackUrl="/account") { const user=await getCurrentUser(); if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`); return user; }
export async function requireAdmin() { const user=await requireUser("/admin"); if (user.role !== "ADMIN") redirect("/"); return user; }
export const requireAuth = requireUser;
