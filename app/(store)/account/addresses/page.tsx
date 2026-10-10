import { requireUser } from "@/lib/auth/session";
export default async function AddressesPage(){await requireUser("/account/addresses");return <main className="section"><span className="eyebrow">Delivery details</span><h1 style={{font:"500 60px Georgia,serif",letterSpacing:"-3px"}}>Your addresses</h1><p style={{color:"var(--muted)"}}>Saved delivery addresses will appear here.</p></main>}
