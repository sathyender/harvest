"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { getSeasonStatus } from "@/lib/seasonal/current";

type PulseMode = "peak" | "fresh" | "gift";

export function HarvestPulse({ products, seasonName }: { products: Product[]; seasonName: Product["season"] }) {
  const [mode, setMode] = useState<PulseMode>("peak");
  const picks = useMemo(() => {
    const seasonal = products.filter((product) => product.season === seasonName || product.season === "Year-round");
    if (mode === "fresh") return [...seasonal].sort((a, b) => b.freshnessScore - a.freshnessScore).slice(0, 3);
    if (mode === "gift") return products.filter((product) => product.category === "boxes").slice(0, 3);
    return seasonal.filter((product) => product.inSeason).slice(0, 3);
  }, [mode, products, seasonName]);
  const modes: Array<{ id: PulseMode; label: string; note: string }> = [
    { id: "peak", label: "Peak right now", note: "Naturally in season" },
    { id: "fresh", label: "Freshest picks", note: "Highest freshness scores" },
    { id: "gift", label: "Send some joy", note: "Curated fruit boxes" },
  ];
  return <section className="pulse-section" id="harvest" aria-labelledby="harvest-pulse-title"><div className="pulse-orbit" aria-hidden="true"><span>✦</span><i /><i /><i /></div><div className="pulse-copy"><span className="eyebrow">Live harvest intelligence</span><h2 id="harvest-pulse-title">Your fruit bowl,<br /><em>in its element.</em></h2><p>Follow the season, discover a new favourite, and let nature do the recommending.</p><Link className="pulse-link" href="/seasons/current">Explore the season <span>→</span></Link></div><div className="pulse-panel"><div className="pulse-tabs" role="tablist" aria-label="Harvest recommendations">{modes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} className={mode === item.id ? "active" : ""} onClick={() => setMode(item.id)}>{item.label}</button>)}</div><div className="pulse-note">{modes.find((item) => item.id === mode)?.note}<span>{seasonName} collection</span></div><div className="pulse-picks">{picks.map((product, index) => <Link href={`/products/${product.slug}`} className="pulse-pick" key={product.id}><span className="pulse-number">0{index + 1}</span><div><strong>{product.name}</strong><small>{mode === "gift" ? "Made to share" : getSeasonStatus(product.peakMonths)}</small></div><span className="pulse-arrow">↗</span></Link>)}</div></div></section>;
}
