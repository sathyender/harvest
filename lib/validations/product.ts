import { z } from "zod";
export const productQuerySchema = z.object({ search: z.string().trim().optional(), category: z.string().trim().optional() });
