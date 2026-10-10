import { ProductExplorer } from "@/components/products/ProductExplorer";
import { products } from "@/lib/data/products";
export default function ProductsPage() { return <main className="section"><div className="catalog-intro"><span className="eyebrow">The full harvest · carefully selected</span><h1>Fruit worth<br/><em style={{color:"var(--wine)",fontStyle:"italic"}}>remembering.</em></h1><p>From orchard classics to rare seasonal finds, every box is chosen for flavour, freshness and the moment it is meant to be enjoyed.</p></div><ProductExplorer products={products}/></main>; }
