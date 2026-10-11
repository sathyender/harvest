"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/actions/cart";

export function AddToCartButton({ productSlug, label = "Add to bag" }: { productSlug: string; label?: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  return <div>
    <button type="button" className="button" disabled={pending} onClick={() => startTransition(async () => {
      try {
        const result = await addToCart({ productSlug, quantity: 1 });
        setSuccess(result.ok);
        setMessage(result.message ?? (result.ok ? "Added to your bag." : "We couldn't add this fruit to your bag."));
      } catch {
        setSuccess(false);
        setMessage("We couldn't reach the store. Please try again.");
      }
    })}>{pending ? "Adding…" : `${label}  +`}</button>
    {message ? <p role="status" aria-live="polite" style={{ color: success ? "var(--green)" : "var(--wine)", fontSize: 12, marginTop: 8 }}>{message}</p> : null}
  </div>;
}