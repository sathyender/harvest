"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/actions/cart";

export function AddToCartButton({ productSlug, label = "Add to bag" }: { productSlug: string; label?: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return <div>
    <button type="button" className="button" disabled={pending} onClick={() => startTransition(async () => {
      const result = await addToCart({ productSlug, quantity: 1 });
      setMessage(result.message ?? "");
    })}>{pending ? "Adding…" : `${label}  +`}</button>
    {message ? <p role="status" style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>{message}</p> : null}
  </div>;
}
