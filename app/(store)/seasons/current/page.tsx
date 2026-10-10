import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/products/product-card";
import { getCurrentSeason } from "@/lib/seasonal/current";
export default function CurrentSeasonPage() { const season = getCurrentSeason(); return <main className="section"><span className="eyebrow">The seasonal guide</span><h1 style={{font:"500 clamp(48px,7vw,88px)/.95 Georgia,serif",letterSpacing:"-4px",margin:"20px 0 50px"}}>{season.name}, in its<br/><em style={{color:"#d27d57"}}>best light.</em></h1><div className="product-grid">{products.filter((product) => product.inSeason).map((product) => <ProductCard key={product.id} product={product} />)}</div></main>; }
