import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({ ...authConfig, providers:[Credentials({ credentials:{ email:{label:"Email"}, password:{label:"Password",type:"password"} }, async authorize(credentials) { const parsed=loginSchema.safeParse(credentials); if (!parsed.success) return null; const user=await db.user.findUnique({ where:{email:parsed.data.email.toLowerCase()} }); if (!user || !user.isActive || !(await bcrypt.compare(parsed.data.password,user.passwordHash))) return null; return { id:user.id, name:user.name, email:user.email, role:user.role }; } })], callbacks:{ ...authConfig.callbacks, jwt({token,user}) { if(user) { token.id=user.id; token.role=user.role; } return token; }, session({session,token}) { if(session.user) { session.user.id=token.id as string; session.user.role=token.role as import("@prisma/client").Role; } return session; } } });
