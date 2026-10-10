export function safeRedirectPath(value: string | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  try {
    const target = new URL(value, "https://local.invalid");
    if (target.origin !== "https://local.invalid") return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}