import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Header() {
  return <header className="site-header"><Link className="brand" href="/"><span className="brand-mark">✦</span><span>{siteConfig.name}<small>SEASONAL MARKETPLACE</small></span></Link><nav>{siteConfig.nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="header-actions"><Link href="/products" aria-label="Search">⌕</Link><Link href="/account" aria-label="Account">◎</Link><Link href="/cart" className="cart-link">Bag <span>0</span></Link></div></header>;
}
