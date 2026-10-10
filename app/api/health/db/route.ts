import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { databaseFailureKind, databaseLogDetails } from "@/lib/db/diagnostics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw(Prisma.sql`SELECT 1`);
    await db.user.count();
    return NextResponse.json({ ok: true, status: "connected" });
  } catch (error) {
    console.error("Database health check failed", databaseLogDetails(error));
    return NextResponse.json({ ok: false, status: databaseFailureKind(error) }, { status: 503 });
  }
}
