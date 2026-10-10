/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { getProduct } from "@/lib/data/products";
import { getSeasonStatus } from "@/lib/seasonal/current";
import { formatPrice } from "@/lib/utils/format";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const seasonStatus = getSeasonStatus(product.peakMonths);
  return <main className="section"><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw", alignItems: "start" }}><div className="product-image-wrap" style={{ background: product.accent }}><img src={product.image} alt={product.name} /></div><div><span className="eyebrow">{product.variety} · {product.category}</span><h1 style={{ font: "500 clamp(42px,5vw,72px)/1 Georgia,serif", letterSpacing: "-3px", margin: "20px 0" }}>{product.name}</h1><div className="season-fruits"><span>{seasonStatus}</span><span>{product.readyStatus}</span><span>Freshness {product.freshnessScore}/100</span></div><p style={{ lineHeight: 1.8, color: "var(--muted)", maxWidth: 430, marginTop: 25 }}>{product.description}</p><div className="season-fruits">{product.tasteTags.map((tag) => <span key={tag}>{tag}</span>)}</div><p style={{ fontSize: 22, color: "var(--green)", marginTop: 30 }}>{formatPrice(product.price)} <small style={{ fontSize: 12 }}>/ {product.unit}</small></p><AddToCartButton productSlug={product.slug} /><div style={{ marginTop: 38, borderTop: "1px solid var(--line)", paddingTop: 22 }}><p className="eyebrow">How to enjoy it</p><p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted)" }}><strong>Ripeness:</strong> {product.ripeness}</p><p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted)" }}><strong>Storage:</strong> {product.storage}</p><p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted)" }}><strong>General nutrition:</strong> {product.nutrition.join(" · ")}. Values vary by variety and serving size.</p></div></div></div></main>;
}
