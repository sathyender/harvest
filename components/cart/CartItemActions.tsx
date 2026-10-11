"use client";

import { useState, useTransition } from "react";
import { removeFromCart, updateCartItem } from "@/actions/cart";

export function CartItemActions({ productSlug, quantity }: { productSlug: string; quantity: number }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const changeQuantity = (next: number) => startTransition(async () => {
    try {
      const result = next < 1 ? await removeFromCart(productSlug) : await updateCartItem({ productSlug, quantity: next });
      if (!result.ok) {
        setMessage(result.message ?? "We couldn't update this item. Please try again.");
        return;
      }
      window.location.reload();
    } catch {
      setMessage("We couldn't reach the store. Please try again.");
    }
  });
  return <div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button type="button" aria-label="Decrease quantity" disabled={pending} onClick={() => changeQuantity(quantity - 1)}>−</button>
      <span aria-label={`Quantity ${quantity}`}>{quantity}</span>
      <button type="button" aria-label="Increase quantity" disabled={pending} onClick={() => changeQuantity(quantity + 1)}>+</button>
      <button type="button" disabled={pending} onClick={() => changeQuantity(0)} style={{ marginLeft: 12, color: "var(--wine)" }}>Remove</button>
    </div>
    {message ? <p role="status" aria-live="polite" style={{ color: "var(--wine)", fontSize: 12, marginTop: 8 }}>{message}</p> : null}
  </div>;
}