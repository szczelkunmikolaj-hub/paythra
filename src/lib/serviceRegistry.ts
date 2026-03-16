export interface ServiceInfo {
  name: string;
  domain: string;
  color: string;
  category: string;
  logo: string;
  aliases: string[];
}

const services: ServiceInfo[] = [
  { name: "Netflix", domain: "netflix.com", color: "#E50914", category: "streaming", logo: "https://logo.clearbit.com/netflix.com", aliases: ["netflix"] },
  { name: "Spotify", domain: "spotify.com", color: "#1DB954", category: "streaming", logo: "https://logo.clearbit.com/spotify.com", aliases: ["spotify"] },
  { name: "Apple Music", domain: "apple.com", color: "#FA243C", category: "streaming", logo: "https://logo.clearbit.com/apple.com", aliases: ["apple music", "apple.com/bill", "itunes"] },
  { name: "Disney+", domain: "disneyplus.com", color: "#113CCF", category: "streaming", logo: "https://logo.clearbit.com/disneyplus.com", aliases: ["disney+", "disney plus", "disneyplus"] },
  { name: "Amazon Prime", domain: "amazon.com", color: "#FF9900", category: "streaming", logo: "https://logo.clearbit.com/amazon.com", aliases: ["amazon prime", "prime video", "amazon"] },
  { name: "YouTube Premium", domain: "youtube.com", color: "#FF0000", category: "streaming", logo: "https://logo.clearbit.com/youtube.com", aliases: ["youtube premium", "youtube", "google *youtube"] },
  { name: "HBO Max", domain: "hbomax.com", color: "#5822B4", category: "streaming", logo: "https://logo.clearbit.com/hbomax.com", aliases: ["hbo max", "hbo", "max"] },
  { name: "ChatGPT Plus", domain: "openai.com", color: "#10A37F", category: "software", logo: "https://logo.clearbit.com/openai.com", aliases: ["chatgpt", "openai", "chatgpt plus"] },
  { name: "Notion", domain: "notion.so", color: "#000000", category: "productivity", logo: "https://logo.clearbit.com/notion.so", aliases: ["notion"] },
  { name: "Canva", domain: "canva.com", color: "#00C4CC", category: "software", logo: "https://logo.clearbit.com/canva.com", aliases: ["canva"] },
  { name: "Adobe Creative Cloud", domain: "adobe.com", color: "#FF0000", category: "software", logo: "https://logo.clearbit.com/adobe.com", aliases: ["adobe", "creative cloud", "photoshop", "illustrator"] },
  { name: "Dropbox", domain: "dropbox.com", color: "#0061FF", category: "productivity", logo: "https://logo.clearbit.com/dropbox.com", aliases: ["dropbox"] },
  { name: "Google One", domain: "google.com", color: "#4285F4", category: "productivity", logo: "https://logo.clearbit.com/google.com", aliases: ["google one", "google storage"] },
  { name: "Xbox Game Pass", domain: "xbox.com", color: "#107C10", category: "gaming", logo: "https://logo.clearbit.com/xbox.com", aliases: ["xbox", "game pass", "xbox game pass"] },
  { name: "PlayStation Plus", domain: "playstation.com", color: "#003087", category: "gaming", logo: "https://logo.clearbit.com/playstation.com", aliases: ["playstation", "ps plus", "psn"] },
  { name: "Nintendo Switch Online", domain: "nintendo.com", color: "#E60012", category: "gaming", logo: "https://logo.clearbit.com/nintendo.com", aliases: ["nintendo", "switch online"] },
  { name: "DAZN", domain: "dazn.com", color: "#F5F5F5", category: "sports", logo: "https://logo.clearbit.com/dazn.com", aliases: ["dazn"] },
  { name: "F1 TV", domain: "formula1.com", color: "#E10600", category: "sports", logo: "https://logo.clearbit.com/formula1.com", aliases: ["f1 tv", "formula 1", "f1"] },
  { name: "NBA League Pass", domain: "nba.com", color: "#1D428A", category: "sports", logo: "https://logo.clearbit.com/nba.com", aliases: ["nba", "league pass"] },
  { name: "ESPN+", domain: "espn.com", color: "#D00", category: "sports", logo: "https://logo.clearbit.com/espn.com", aliases: ["espn", "espn+"] },
  { name: "Microsoft 365", domain: "microsoft.com", color: "#0078D4", category: "productivity", logo: "https://logo.clearbit.com/microsoft.com", aliases: ["microsoft 365", "office 365", "microsoft"] },
  { name: "iCloud+", domain: "icloud.com", color: "#3693F3", category: "productivity", logo: "https://logo.clearbit.com/icloud.com", aliases: ["icloud", "icloud+"] },
  { name: "Slack", domain: "slack.com", color: "#4A154B", category: "productivity", logo: "https://logo.clearbit.com/slack.com", aliases: ["slack"] },
  { name: "GitHub", domain: "github.com", color: "#181717", category: "software", logo: "https://logo.clearbit.com/github.com", aliases: ["github"] },
  { name: "Figma", domain: "figma.com", color: "#F24E1E", category: "software", logo: "https://logo.clearbit.com/figma.com", aliases: ["figma"] },
  { name: "LinkedIn Premium", domain: "linkedin.com", color: "#0A66C2", category: "productivity", logo: "https://logo.clearbit.com/linkedin.com", aliases: ["linkedin"] },
  { name: "Crunchyroll", domain: "crunchyroll.com", color: "#F47521", category: "streaming", logo: "https://logo.clearbit.com/crunchyroll.com", aliases: ["crunchyroll"] },
  { name: "Paramount+", domain: "paramountplus.com", color: "#0064FF", category: "streaming", logo: "https://logo.clearbit.com/paramountplus.com", aliases: ["paramount+", "paramount plus"] },
];

export const SERVICE_REGISTRY = services;

export const findService = (query: string): ServiceInfo | undefined => {
  const q = query.toLowerCase().trim();
  return services.find(
    (s) =>
      s.name.toLowerCase() === q ||
      s.aliases.some((a) => q.includes(a) || a.includes(q))
  );
};

export const searchServices = (query: string): ServiceInfo[] => {
  if (!query.trim()) return services;
  const q = query.toLowerCase().trim();
  return services.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.aliases.some((a) => a.includes(q))
  );
};

export const getServiceLogo = (name: string): string | null => {
  const service = findService(name);
  return service?.logo ?? null;
};

export const getServiceColor = (name: string): string | null => {
  const service = findService(name);
  return service?.color ?? null;
};
