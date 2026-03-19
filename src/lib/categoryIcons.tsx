import { Tv, Music, Activity, Monitor, Gamepad2, Briefcase, Circle, Heart, type LucideIcon } from "lucide-react";

export interface CategoryIconConfig {
  icon: LucideIcon;
  color: string;        // tailwind text color
  bgColor: string;      // tailwind bg color
  hexColor: string;     // for recharts / non-tailwind
}

export const CATEGORY_ICONS: Record<string, CategoryIconConfig> = {
  streaming: { icon: Tv, color: "text-blue-500", bgColor: "bg-blue-500/15", hexColor: "#3b82f6" },
  music: { icon: Music, color: "text-green-500", bgColor: "bg-green-500/15", hexColor: "#22c55e" },
  sports: { icon: Activity, color: "text-orange-500", bgColor: "bg-orange-500/15", hexColor: "#f97316" },
  software: { icon: Monitor, color: "text-violet-500", bgColor: "bg-violet-500/15", hexColor: "#8b5cf6" },
  gaming: { icon: Gamepad2, color: "text-indigo-500", bgColor: "bg-indigo-500/15", hexColor: "#6366f1" },
  productivity: { icon: Briefcase, color: "text-cyan-500", bgColor: "bg-cyan-500/15", hexColor: "#06b6d4" },
  health: { icon: Heart, color: "text-rose-500", bgColor: "bg-rose-500/15", hexColor: "#f43f5e" },
  other: { icon: Circle, color: "text-gray-400", bgColor: "bg-gray-400/15", hexColor: "#9ca3af" },
};

// Auto-detect category from subscription name
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  streaming: ["netflix", "disney", "hulu", "hbo", "max", "paramount", "peacock", "apple tv", "crunchyroll", "prime video", "amazon prime", "twitch", "tidal", "deezer", "amazon music", "youtube"],
  music: ["spotify", "apple music", "tidal", "deezer", "amazon music", "soundcloud"],
  sports: ["espn", "dazn", "f1", "nba", "nfl", "mlb", "sky sports", "strava", "formula"],
  software: ["chatgpt", "openai", "adobe", "canva", "figma", "github", "midjourney", "claude", "anthropic", "grammarly", "1password", "lastpass", "nordvpn", "expressvpn"],
  gaming: ["xbox", "game pass", "playstation", "ps plus", "psn", "nintendo", "ea play", "ubisoft", "geforce"],
  productivity: ["notion", "dropbox", "google one", "microsoft 365", "office 365", "icloud", "slack", "linkedin", "zoom", "evernote", "todoist", "trello", "asana"],
  health: ["headspace", "calm", "peloton", "myfitnesspal", "fitbit"],
};

export function detectCategory(name: string): string {
  const q = name.toLowerCase().trim();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) return category;
  }
  return "other";
}

export function getCategoryIcon(category: string): CategoryIconConfig {
  return CATEGORY_ICONS[category] ?? CATEGORY_ICONS.other;
}

export function getIconForSubscription(name: string, category: string): CategoryIconConfig {
  // Try to auto-detect a more specific category
  const detected = detectCategory(name);
  if (detected !== "other") return getCategoryIcon(detected);
  return getCategoryIcon(category);
}
