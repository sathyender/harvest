"use server";

import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { signIn, signOut } from "@/lib/auth/auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { fieldErrors } from "@/lib/utils/zod";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";
import { databaseLogDetails, databaseUserMessage } from "@/lib/db/diagnostics";
import type { ActionState } from "@/types/actions";

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export async function registerAction(_previous: ActionState, form: FormData): Promise<ActionState> {
  const raw = { name: text(form, "name"), email: text(form, "email").toLowerCase(), phone: text(form, "phone"), password: text(form, "password"), confirmPassword: text(form, "confirmPassword") };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), values: raw };

  try {
    await db.user.create({ data: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null, passwordHash: await bcrypt.hash(parsed.data.password, 12), cart: { create: {} }, wishlist: { create: {} } } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { success: false, message: "An account with this email already exists.", fieldErrors: { email: "An account with this email already exists." }, values: raw };
    if (error instanceof Prisma.PrismaClientInitializationError || error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Registration database failure", databaseLogDetails(error));
      return { success: false, message: databaseUserMessage(error), values: raw };
    }
    console.error("Registration failed", databaseLogDetails(error));
    return { success: false, message: "We could not create your account right now. Please try again.", values: raw };
  }
  try { await signIn("credentials", { email: parsed.data.email, password: parsed.data.password, redirectTo: "/" }); return { success: true }; } catch (error) { if (error instanceof AuthError) return { success: false, message: "Your account was created. Please sign in.", values: raw }; throw error; }
}

export async function loginAction(_previous: ActionState, form: FormData): Promise<ActionState> {
  const raw = { email: text(form, "email").toLowerCase(), password: text(form, "password") };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: "Enter a valid email and password.", values: { email: raw.email } };
  let destination = "/";
  try { const found = await db.user.findUnique({ where: { email: parsed.data.email }, select: { role: true } }); destination = safeRedirectPath(text(form, "callbackUrl"), found?.role === "ADMIN" ? "/admin" : "/"); } catch (error) { console.error("Login lookup failed", databaseLogDetails(error)); return { success: false, message: databaseUserMessage(error), values: { email: raw.email } }; }
  try { await signIn("credentials", { ...parsed.data, redirectTo: destination }); return { success: true }; } catch (error) { if (error instanceof AuthError) return { success: false, message: "Invalid email or password.", values: { email: raw.email } }; throw error; }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
