import { NextResponse } from "next/server";

const themes: Record<string, { emoji: string; color: string; accent: string }> = {
  mangoes: { emoji: "🥭", color: "#f4c95d", accent: "#d88a32" },
  citrus: { emoji: "🍊", color: "#f3a64d", accent: "#d86d32" },
  berries: { emoji: "🍇", color: "#d9bfdc", accent: "#765080" },
  tropical: { emoji: "🍍", color: "#cfe1bd", accent: "#4d7955" },
  melons: { emoji: "🍉", color: "#f1c8bb", accent: "#b84f50" },
  apples: { emoji: "🍎", color: "#e8c3bd", accent: "#a24f45" },
  stone: { emoji: "🍑", color: "#f2d0ad", accent: "#bd704e" },
  everyday: { emoji: "🍌", color: "#e9dc9a", accent: "#9d7b2d" },
  exotic: { emoji: "🥝", color: "#c2d5b3", accent: "#52734c" },
  boxes: { emoji: "🍓", color: "#e5c2c2", accent: "#914c55" },
};

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);
}

export function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const requestedCategory = new URL(request.url).searchParams.get("category");
  const category = requestedCategory && requestedCategory in themes ? requestedCategory : Object.keys(themes).find((key) => slug.includes(key)) ?? (slug.includes("box") || slug.includes("basket") ? "boxes" : "tropical");
  const theme = themes[category];
  const title = escapeXml(slug === "market-hero" ? "Fresh by season" : slug.replace(/-/g, " "));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 980"><rect width="900" height="980" fill="${theme.color}"/><circle cx="740" cy="150" r="190" fill="${theme.accent}" opacity=".12"/><circle cx="120" cy="850" r="260" fill="#fffaf0" opacity=".34"/><path d="M0 780 Q220 650 450 780 T900 760 V980 H0Z" fill="#fffaf0" opacity=".45"/><text x="450" y="480" text-anchor="middle" font-size="245" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">${theme.emoji}</text><text x="450" y="720" text-anchor="middle" fill="#20352d" font-size="38" font-family="Georgia, serif" font-weight="bold">${title}</text><text x="450" y="775" text-anchor="middle" fill="${theme.accent}" font-size="16" font-family="Arial, sans-serif" letter-spacing="4">HARVEST &amp; HUE</text></svg>`;
  return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
}
