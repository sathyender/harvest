"use client";

import { useTransition } from "react";
import { removeFromCart, updateCartItem } from "@/actions/cart";

export function CartItemActions({ productSlug, quantity }: { productSlug: string; quantity: number }) {
  const [pending, startTransition] = useTransition();
  const changeQuantity = (next: number) => startTransition(async () => {
    if (next < 1) await removeFromCart(productSlug);
    else await updateCartItem({ productSlug, quantity: next });
    window.location.reload();
  });
  return <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <button type="button" aria-label="Decrease quantity" disabled={pending} onClick={() => changeQuantity(quantity - 1)}>−</button>
    <span aria-label={`Quantity ${quantity}`}>{quantity}</span>
    <button type="button" aria-label="Increase quantity" disabled={pending} onClick={() => changeQuantity(quantity + 1)}>+</button>
    <button type="button" disabled={pending} onClick={() => changeQuantity(0)} style={{ marginLeft: 12, color: "var(--wine)" }}>Remove</button>
  </div>;
}
