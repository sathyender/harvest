import { requireUser } from "@/lib/auth/session";
export default async function WishlistPage(){await requireUser("/wishlist");return <main className="section"><span className="eyebrow">Saved for later</span><h1 style={{font:"500 60px Georgia,serif",letterSpacing:"-3px"}}>Your wishlist</h1><p style={{color:"var(--muted)"}}>Your saved fruit will appear here.</p></main>}
