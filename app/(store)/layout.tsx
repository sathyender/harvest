import { Header } from "@/components/layout/header";
export default function StoreLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <><Header />{children}<footer className="footer"><span>© 2026 Harvest & Hue</span><span>Grown with patience · Delivered with care</span></footer></>; }
