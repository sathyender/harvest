"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

const itemSchema = z.object({ productSlug: z.string().trim().min(1).max(160), quantity: z.number().int().positive().max(20).default(1) });
const productSlugSchema = z.string().trim().min(1).max(160);

type CartActionResult = { ok: boolean; message?: string };

function invalidInput(): CartActionResult {
  return { ok: false, message: "That cart request is invalid." };
}

export async function addToCart(input: unknown): Promise<CartActionResult> {
  const user = await requireUser("/cart");
  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) return invalidInput();
  const item = parsed.data;
  const product = await db.product.findUnique({ where: { slug: item.productSlug }, include: { inventory: true } });
  if (!product?.isActive) return { ok: false, message: "This fruit is no longer available." };
  const cart = await db.cart.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
  const existing = await db.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId: product.id } } });
  const quantity = (existing?.quantity ?? 0) + item.quantity;
  const maximum = Math.min(product.maxOrderQty, product.inventory?.quantity ?? 0);
  if (maximum < quantity) return { ok: false, message: "That quantity is not currently in stock." };
  await db.cartItem.upsert({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, create: { cartId: cart.id, productId: product.id, quantity }, update: { quantity } });
  return { ok: true, message: `${product.name} added to your bag.` };
}

export async function updateCartItem(input: unknown): Promise<CartActionResult> {
  const user = await requireUser("/cart");
  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) return invalidInput();
  const item = parsed.data;
  const [product, cart] = await Promise.all([
    db.product.findUnique({ where: { slug: item.productSlug }, include: { inventory: true } }),
    db.cart.findUnique({ where: { userId: user.id } }),
  ]);
  if (!product?.isActive || !cart) return { ok: false, message: "This cart item is no longer available." };
  if (item.quantity > Math.min(product.maxOrderQty, product.inventory?.quantity ?? 0)) return { ok: false, message: "That quantity is not currently in stock." };
  await db.cartItem.update({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, data: { quantity: item.quantity } });
  return { ok: true };
}

export async function removeFromCart(productSlug: string): Promise<CartActionResult> {
  const user = await requireUser("/cart");
  const parsedSlug = productSlugSchema.safeParse(productSlug);
  if (!parsedSlug.success) return invalidInput();
  const [product, cart] = await Promise.all([
    db.product.findUnique({ where: { slug: parsedSlug.data }, select: { id: true } }),
    db.cart.findUnique({ where: { userId: user.id }, select: { id: true } }),
  ]);
  if (product && cart) await db.cartItem.deleteMany({ where: { cartId: cart.id, productId: product.id } });
  return { ok: true };
}
