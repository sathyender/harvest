"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="section"><p className="eyebrow">Something went wrong</p><h1>We couldn&apos;t load this page.</h1><p style={{ color: "var(--muted)", marginTop: 16 }}>Please try again. If the problem continues, check the server and database configuration.</p><button type="button" className="button" onClick={() => reset()}>Try again</button></main>;
}
