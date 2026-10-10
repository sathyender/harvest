/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { getSeasonStatus } from "@/lib/seasonal/current";
import { ProductCard } from "@/components/products/product-card";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function SeasonCalendar({ products }: { products: Product[] }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const seasonal = useMemo(() => products.filter((product) => product.peakMonths.length === 0 || product.peakMonths.includes(month) || product.peakMonths.includes(month === 12 ? 1 : month + 1)).slice(0, 4), [month, products]);
  return <div className="calendar-card"><div className="calendar-top"><div><span className="eyebrow">Plan your fruit bowl</span><h2>Fruit season calendar</h2><p>See what is at its best, month by month.</p></div><select aria-label="Choose a month" value={month} onChange={(event) => setMonth(Number(event.target.value))}>{months.map((name, index) => <option value={index + 1} key={name}>{name}</option>)}</select></div><div className="month-row">{months.map((name, index) => <button type="button" key={name} className={month === index + 1 ? "active" : ""} onClick={() => setMonth(index + 1)}>{name.slice(0, 3)}</button>)}</div><div className="calendar-results"><span className="eyebrow">Best around {months[month - 1]}</span><div className="calendar-product-grid">{seasonal.map((product) => <div className="calendar-product" key={product.id}><img src={product.image} alt={product.name}/><div><strong>{product.name}</strong><small>{getSeasonStatus(product.peakMonths, month)}</small></div></div>)}</div></div></div>;
}
