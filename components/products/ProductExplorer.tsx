"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

export function ProductExplorer({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [taste, setTaste] = useState("all");
  const [seasonOnly, setSeasonOnly] = useState(false);
  const [sort, setSort] = useState("curated");
  const categories = Array.from(new Set(products.map((product) => product.category)));
  const tastes = Array.from(new Set(products.flatMap((product) => product.tasteTags))).slice(0, 8);
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesTaste = taste === "all" || product.tasteTags.includes(taste);
      const matchesSeason = !seasonOnly || product.inSeason;
      const searchableText = [product.name, product.variety, product.category, product.badge, ...product.tasteTags].filter(Boolean).join(" ").toLowerCase();
      return matchesCategory && matchesTaste && matchesSeason && (!query || searchableText.includes(query));
    });
    if (sort === "freshest") filtered.sort((a, b) => b.freshnessScore - a.freshnessScore);
    if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, search, selectedCategory, seasonOnly, sort, taste]);
  return <><div className="product-search"><label htmlFor="fruit-search">Find your fruit</label><div className="search-field"><span aria-hidden="true">⌕</span><input id="fruit-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search mangoes, citrus, berries..."/><button type="button" onClick={() => setSearch("")} disabled={!search} aria-label="Clear search">Clear</button></div></div><div className="discovery-toolbar"><div><span className="toolbar-label">Mood</span><div className="taste-ribbon"><button type="button" className={taste === "all" ? "selected" : ""} onClick={() => setTaste("all")}>Anything delicious</button>{tastes.map((item) => <button type="button" className={taste === item ? "selected" : ""} key={item} onClick={() => setTaste(item)}>{item}</button>)}</div></div><label className="season-toggle"><input type="checkbox" checked={seasonOnly} onChange={(event) => setSeasonOnly(event.target.checked)} /><span className="toggle-track" />In season only</label><label className="sort-select">Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="curated">Curated</option><option value="freshest">Freshest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div><div className="category-ribbon"><button type="button" className={selectedCategory === "all" ? "selected" : ""} onClick={() => setSelectedCategory("all")}>All fruit</button>{categories.map((category) => <button type="button" className={selectedCategory === category ? "selected" : ""} key={category} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div><div className="section-heading"><span className="eyebrow">{visibleProducts.length} varieties to explore</span><span className="eyebrow">{search ? `Results for “${search}”` : selectedCategory === "all" ? "Freshly curated" : `Showing ${selectedCategory}`}</span></div>{visibleProducts.length > 0 ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state">No fruit found. Try another name, variety, or category.</div>}</>;
}
