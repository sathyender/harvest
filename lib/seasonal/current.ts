export const seasons = [
  { name: "Summer", months: [3, 4, 5, 6], eyebrow: "The golden hour of fruit", color: "#f6b442", emoji: "☀️" },
  { name: "Monsoon", months: [7, 8, 9], eyebrow: "Rain-kissed and wonderfully ripe", color: "#709b77", emoji: "🌧️" },
  { name: "Winter", months: [10, 11, 12, 1, 2], eyebrow: "Crisp days, sweeter harvests", color: "#e7a09a", emoji: "❄️" },
] as const;

export function getCurrentSeason(month = new Date().getMonth() + 1) {
  return seasons.find((season) => (season.months as readonly number[]).includes(month)) ?? seasons[0];
}

export function getSeasonStatus(peakMonths: number[], month = new Date().getMonth() + 1) {
  if (peakMonths.length === 0) return "Available year-round";
  if (peakMonths.includes(month)) return "Peak season";
  const nextMonth = month === 12 ? 1 : month + 1;
  if (peakMonths.includes(nextMonth)) return "Coming soon";
  return "Out of season";
}
