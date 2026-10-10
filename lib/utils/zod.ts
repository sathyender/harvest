import type { z } from "zod";
export function fieldErrors(error: z.ZodError) { return error.issues.reduce<Record<string,string>>((result, issue) => { const key = String(issue.path[0] ?? "form"); if (!result[key]) result[key] = issue.message; return result; }, {}); }
