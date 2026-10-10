/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/format";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card"><div className="product-image-wrap" style={{ background: product.accent }}><Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} /></Link><button type="button" className="heart" aria-label={`Save ${product.name}`} title="Wishlist is not enabled yet" disabled>♡</button>{product.badge && <span className="product-badge">{product.badge}</span>}</div><div className="product-info"><div><p className="product-variety">{product.variety}</p><Link href={`/products/${product.slug}`}><h3>{product.name}</h3></Link></div><div className="product-meta"><span>{formatPrice(product.price)} <small>/ {product.unit}</small></span><AddToCartButton productSlug={product.slug} label="" /></div></div></article>;
}
