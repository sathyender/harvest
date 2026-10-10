import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { CartItemActions } from "@/components/cart/CartItemActions";
import { formatPrice } from "@/lib/utils/format";

export default async function CartPage() {
  const user = await requireUser("/cart");
  const cart = await db.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { product: true }, orderBy: { id: "asc" } } } });
  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.quantity * item.product.pricePaise, 0);
  return <main className="section"><span className="eyebrow">Your harvest</span><h1 style={{ font: "500 60px Georgia,serif", letterSpacing: "-3px" }}>Your bag</h1>{items.length === 0 ? <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Your bag is empty. <a href="/products" style={{ color: "var(--green)", textDecoration: "underline" }}>Explore the harvest →</a></p> : <div style={{ maxWidth: 760, marginTop: 32 }}>{items.map((item) => <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center", padding: "18px 0", borderBottom: "1px solid var(--line)" }}><div><a href={`/products/${item.product.slug}`} style={{ fontFamily: "Georgia, serif", fontSize: 20 }}>{item.product.name}</a><p style={{ color: "var(--muted)", fontSize: 13 }}>{formatPrice(item.product.pricePaise)} / {item.product.unit.toLowerCase()}</p></div><CartItemActions productSlug={item.product.slug} quantity={item.quantity} /></div>)}<div style={{ textAlign: "right", marginTop: 28, fontFamily: "Georgia, serif", fontSize: 24 }}>Subtotal {formatPrice(total)}</div></div>}</main>;
}
