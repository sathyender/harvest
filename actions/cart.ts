"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { databaseLogDetails, databaseUserMessage } from "@/lib/db/diagnostics";

const itemSchema = z.object({ productSlug: z.string().trim().min(1).max(160), quantity: z.number().int().positive().max(20).default(1) });
const productSlugSchema = z.string().trim().min(1).max(160);
const catalogSlugAliases: Record<string, string> = {
  "ratnagiri-alphonso": "alphonso-mango",
  "muzaffarpur-lychee": "lychee",
  "indian-jamun": "jamun",
};

type CartActionResult = { ok: boolean; message?: string };

function invalidInput(): CartActionResult {
  return { ok: false, message: "That cart request is invalid." };
}

function databaseFailure(action: string, error: unknown): CartActionResult {
  console.error(`${action} failed`, databaseLogDetails(error));
  return { ok: false, message: databaseUserMessage(error) };
}

async function findProduct(slug: string) {
  const exact = await db.product.findUnique({ where: { slug }, include: { inventory: true } });
  if (exact) return exact;
  const legacySlug = catalogSlugAliases[slug];
  return legacySlug ? db.product.findUnique({ where: { slug: legacySlug }, include: { inventory: true } }) : null;
}

export async function addToCart(input: unknown): Promise<CartActionResult> {
  const user = await requireUser("/cart");
  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) return invalidInput();
  const item = parsed.data;
  try {
    const product = await findProduct(item.productSlug);
    if (!product?.isActive) return { ok: false, message: "This fruit is no longer available." };
    const cart = await db.cart.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
    const existing = await db.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId: product.id } } });
    const quantity = (existing?.quantity ?? 0) + item.quantity;
    const maximum = Math.min(product.maxOrderQty, product.inventory?.quantity ?? 0);
    if (maximum < quantity) return { ok: false, message: "That quantity is not currently in stock." };
    await db.cartItem.upsert({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, create: { cartId: cart.id, productId: product.id, quantity }, update: { quantity } });
    revalidatePath("/cart");
    return { ok: true, message: `${product.name} added to your bag.` };
  } catch (error) {
    return databaseFailure("Add to cart", error);
  }
}

export async function updateCartItem(input: unknown): Promise<CartActionResult> {
  const user = await requireUser("/cart");
  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) return invalidInput();
  const item = parsed.data;
  try {
    const [product, cart] = await Promise.all([
      findProduct(item.productSlug),
      db.cart.findUnique({ where: { userId: user.id } }),
    ]);
    if (!product?.isActive || !cart) return { ok: false, message: "This cart item is no longer available." };
    if (item.quantity > Math.min(product.maxOrderQty, product.inventory?.quantity ?? 0)) return { ok: false, message: "That quantity is not currently in stock." };
    await db.cartItem.update({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, data: { quantity: item.quantity } });
    revalidatePath("/cart");
    return { ok: true };
  } catch (error) {
    return databaseFailure("Update cart", error);
  }
}

export async function removeFromCart(productSlug: string): Promise<CartActionResult> {
  const user = await requireUser("/cart");
  const parsedSlug = productSlugSchema.safeParse(productSlug);
  if (!parsedSlug.success) return invalidInput();
  try {
    const [product, cart] = await Promise.all([
      findProduct(parsedSlug.data),
      db.cart.findUnique({ where: { userId: user.id }, select: { id: true } }),
    ]);
    if (product && cart) await db.cartItem.deleteMany({ where: { cartId: cart.id, productId: product.id } });
    revalidatePath("/cart");
    return { ok: true };
  } catch (error) {
    return databaseFailure("Remove from cart", error);
  }
}