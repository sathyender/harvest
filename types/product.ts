export type Product = {
  id: string; slug: string; name: string; variety: string; category: string;
  price: number; unit: string; image: string; accent: string; badge?: string;
  description: string; inSeason: boolean; rating: number; stock: number;
  season: "Summer" | "Monsoon" | "Winter" | "Year-round";
  peakMonths: number[]; freshnessScore: number; tasteTags: string[];
  storage: string; ripeness: string; readyStatus: "Ready to eat" | "Needs ripening" | "Limited season";
  nutrition: string[];
};
