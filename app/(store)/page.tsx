"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { SeasonCalendar } from "@/components/seasonal/SeasonCalendar";
import { HarvestPulse } from "@/components/seasonal/HarvestPulse";
import { FruitMatch } from "@/components/products/FruitMatch";
import { SectionNav } from "@/components/layout/section-nav";
import { products } from "@/lib/data/products";
import { getCurrentSeason, seasons } from "@/lib/seasonal/current";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("harvest");
  useEffect(() => {
    const syncSection = () => {
      const id = window.location.hash.slice(1);
      if (["harvest", "fruit-match", "home", "best-fruits", "seasons", "calendar", "story"].includes(id)) setActiveSection(id);
    };
    syncSection();
    window.addEventListener("hashchange", syncSection);
    return () => window.removeEventListener("hashchange", syncSection);
  }, []);  const current = getCurrentSeason();
  const bestNow = products.filter((product) => product.season === current.name || product.season === "Year-round").slice(0, 4);
  return <main>
    <SectionNav activeSection={activeSection} onSelect={setActiveSection} />
    <div id="section-panel-harvest" role="tabpanel" aria-labelledby="section-tab-harvest" hidden={activeSection !== "harvest"}>
    <HarvestPulse products={products} seasonName={current.name} />
    </div>
    <div id="section-panel-fruit-match" role="tabpanel" aria-labelledby="section-tab-fruit-match" hidden={activeSection !== "fruit-match"}>
    <FruitMatch products={products} />
    </div>
    <div id="section-panel-home" role="tabpanel" aria-labelledby="section-tab-home" hidden={activeSection !== "home"}>
    <section className="hero" id="home"><div className="hero-copy"><span className="eyebrow">{current.emoji} {current.name} · {current.eyebrow}</span><h1>Fruit at its <em>finest.</em></h1><p>Discover produce at its seasonal best, sourced with care and delivered while it still feels alive.</p><Link className="button" href="/products">Shop this season&nbsp; →</Link><Link className="button light" href="#calendar">Explore the calendar</Link></div><div className="hero-visual"><img src="/api/images/market-hero" alt="Illustrated seasonal fruit collection" /><div className="hero-note">Good fruit takes its time.</div></div></section>
    </div>
    <div id="section-panel-best-fruits" role="tabpanel" aria-labelledby="section-tab-best-fruits" hidden={activeSection !== "best-fruits"}>
    <section className="section" id="best-fruits"><div className="section-heading"><div><span className="eyebrow">{current.name} is here</span><h2>Best fruits right now</h2></div><Link className="see-all" href="/seasons/current">See the seasonal guide →</Link></div><div className="product-grid">{bestNow.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    </div>
    <div id="section-panel-seasons" role="tabpanel" aria-labelledby="section-tab-seasons" hidden={activeSection !== "seasons"}>
    <section className="season-guide" id="seasons"><div className="season-guide-intro"><div><span className="eyebrow">A better way to shop</span><h2>Eat with the seasons.</h2></div><p>When fruit is naturally in season, it has more time to develop its character. Follow nature&apos;s calendar and find something delicious.</p></div><div className="season-cards">{seasons.map((season) => <article className="season-card" key={season.name}><span className="season-emoji">{season.emoji}</span><h3>{season.name}</h3><p>{season.eyebrow}. Discover the fruits that are naturally at home in these months.</p><div className="season-fruits">{products.filter((product) => product.season === season.name).slice(0, 4).map((product) => <span key={product.id}>{product.name}</span>)}</div></article>)}</div></section>
    </div>
    <div id="section-panel-calendar" role="tabpanel" aria-labelledby="section-tab-calendar" hidden={activeSection !== "calendar"}>
    <section className="calendar-section" id="calendar"><SeasonCalendar products={products} /></section>
    </div>
    <div id="section-panel-story" role="tabpanel" aria-labelledby="section-tab-story" hidden={activeSection !== "story"}>
    <section className="story" id="story"><div><span className="eyebrow" style={{color:"#b7cfbe"}}>A little more thought</span><h2>Better fruit.<br/>Better days.</h2><p>Seasonality is our north star. We work with farms across India to find fruit when it naturally wants to be here — then get it to you while it’s still full of life.</p><Link className="button" href="/products">Meet the harvest&nbsp; →</Link></div><div className="stats"><div className="stat"><strong>38</strong><span>seasonal varieties</span></div><div className="stat"><strong>100%</strong><span>season-led discovery</span></div><div className="stat"><strong>94</strong><span>freshness score average</span></div><div className="stat"><strong>0</strong><span>unnecessary middlemen</span></div></div></section>
    </div>
  </main>;
}
