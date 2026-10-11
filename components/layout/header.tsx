import Link from "next/link";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";

export async function Header() {
  const session = await auth();
  return <header className="site-header"><Link className="brand" href="/"><span className="brand-mark">✦</span><span>{siteConfig.name}<small>SEASONAL MARKETPLACE</small></span></Link>{session?.user ? <><nav>{siteConfig.nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="header-actions"><Link href="/products" aria-label="Search">⌕</Link><Link href="/account" aria-label="Account">Account</Link><Link href="/cart" className="cart-link">Bag</Link><LogoutButton /></div></> : <div className="header-actions"><Link href="/login">Sign in</Link></div>}</header>;
}
