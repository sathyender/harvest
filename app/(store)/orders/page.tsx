import { requireUser } from "@/lib/auth/session";
export default async function OrdersPage(){await requireUser("/orders");return <main className="section"><span className="eyebrow">Your orders</span><h1 style={{font:"500 60px Georgia,serif",letterSpacing:"-3px"}}>Order history</h1><p style={{color:"var(--muted)"}}>Your confirmed orders will appear here.</p></main>}
