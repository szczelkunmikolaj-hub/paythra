export interface ServiceInfo {
  name: string;
  domain: string;
  color: string;
  category: string;
  logo: string;
  aliases: string[];
}

const services: ServiceInfo[] = [
  // Streaming
  { name: "Netflix", domain: "netflix.com", color: "#E50914", category: "streaming", logo: "https://img.logo.dev/netflix.com?token=demo", aliases: ["netflix", "netflix.com"] },
  { name: "Spotify", domain: "spotify.com", color: "#1DB954", category: "streaming", logo: "https://img.logo.dev/spotify.com?token=demo", aliases: ["spotify"] },
  { name: "Apple Music", domain: "apple.com", color: "#FA243C", category: "streaming", logo: "https://img.logo.dev/apple.com?token=demo", aliases: ["apple music", "apple.com/bill", "itunes"] },
  { name: "Disney+", domain: "disneyplus.com", color: "#113CCF", category: "streaming", logo: "https://img.logo.dev/disneyplus.com?token=demo", aliases: ["disney+", "disney plus", "disneyplus"] },
  { name: "Amazon Prime", domain: "amazon.com", color: "#FF9900", category: "streaming", logo: "https://img.logo.dev/amazon.com?token=demo", aliases: ["amazon prime", "prime video", "amazon"] },
  { name: "YouTube Premium", domain: "youtube.com", color: "#FF0000", category: "streaming", logo: "https://img.logo.dev/youtube.com?token=demo", aliases: ["youtube premium", "youtube", "google *youtube"] },
  { name: "HBO Max", domain: "hbomax.com", color: "#5822B4", category: "streaming", logo: "https://img.logo.dev/hbomax.com?token=demo", aliases: ["hbo max", "hbo", "max"] },
  { name: "Hulu", domain: "hulu.com", color: "#1CE783", category: "streaming", logo: "https://img.logo.dev/hulu.com?token=demo", aliases: ["hulu"] },
  { name: "Paramount+", domain: "paramountplus.com", color: "#0064FF", category: "streaming", logo: "https://img.logo.dev/paramountplus.com?token=demo", aliases: ["paramount+", "paramount plus", "paramount"] },
  { name: "Crunchyroll", domain: "crunchyroll.com", color: "#F47521", category: "streaming", logo: "https://img.logo.dev/crunchyroll.com?token=demo", aliases: ["crunchyroll"] },
  { name: "Peacock", domain: "peacocktv.com", color: "#000000", category: "streaming", logo: "https://img.logo.dev/peacocktv.com?token=demo", aliases: ["peacock"] },
  { name: "Apple TV+", domain: "tv.apple.com", color: "#000000", category: "streaming", logo: "https://img.logo.dev/apple.com?token=demo", aliases: ["apple tv+", "apple tv"] },
  { name: "Tidal", domain: "tidal.com", color: "#000000", category: "streaming", logo: "https://img.logo.dev/tidal.com?token=demo", aliases: ["tidal"] },
  { name: "Deezer", domain: "deezer.com", color: "#A238FF", category: "streaming", logo: "https://img.logo.dev/deezer.com?token=demo", aliases: ["deezer"] },
  { name: "Amazon Music", domain: "music.amazon.com", color: "#25D1DA", category: "streaming", logo: "https://img.logo.dev/amazon.com?token=demo", aliases: ["amazon music"] },
  { name: "Twitch", domain: "twitch.tv", color: "#9146FF", category: "streaming", logo: "https://img.logo.dev/twitch.tv?token=demo", aliases: ["twitch"] },

  // Sports
  { name: "DAZN", domain: "dazn.com", color: "#F5F5F5", category: "sports", logo: "https://img.logo.dev/dazn.com?token=demo", aliases: ["dazn"] },
  { name: "F1 TV", domain: "formula1.com", color: "#E10600", category: "sports", logo: "https://img.logo.dev/formula1.com?token=demo", aliases: ["f1 tv", "formula 1", "f1"] },
  { name: "NBA League Pass", domain: "nba.com", color: "#1D428A", category: "sports", logo: "https://img.logo.dev/nba.com?token=demo", aliases: ["nba", "league pass"] },
  { name: "ESPN+", domain: "espn.com", color: "#DD0000", category: "sports", logo: "https://img.logo.dev/espn.com?token=demo", aliases: ["espn", "espn+"] },
  { name: "Sky Sports", domain: "sky.com", color: "#E10A14", category: "sports", logo: "https://img.logo.dev/sky.com?token=demo", aliases: ["sky sports", "sky"] },
  { name: "NFL+", domain: "nfl.com", color: "#013369", category: "sports", logo: "https://img.logo.dev/nfl.com?token=demo", aliases: ["nfl+", "nfl"] },
  { name: "MLB.TV", domain: "mlb.com", color: "#002D72", category: "sports", logo: "https://img.logo.dev/mlb.com?token=demo", aliases: ["mlb.tv", "mlb"] },
  { name: "Strava", domain: "strava.com", color: "#FC4C02", category: "sports", logo: "https://img.logo.dev/strava.com?token=demo", aliases: ["strava"] },

  // Software & AI
  { name: "ChatGPT Plus", domain: "openai.com", color: "#10A37F", category: "software", logo: "https://img.logo.dev/openai.com?token=demo", aliases: ["chatgpt", "openai", "chatgpt plus"] },
  { name: "Adobe Creative Cloud", domain: "adobe.com", color: "#FF0000", category: "software", logo: "https://img.logo.dev/adobe.com?token=demo", aliases: ["adobe", "creative cloud", "photoshop", "illustrator", "lightroom"] },
  { name: "Canva", domain: "canva.com", color: "#00C4CC", category: "software", logo: "https://img.logo.dev/canva.com?token=demo", aliases: ["canva"] },
  { name: "Figma", domain: "figma.com", color: "#F24E1E", category: "software", logo: "https://img.logo.dev/figma.com?token=demo", aliases: ["figma"] },
  { name: "GitHub", domain: "github.com", color: "#181717", category: "software", logo: "https://img.logo.dev/github.com?token=demo", aliases: ["github"] },
  { name: "Midjourney", domain: "midjourney.com", color: "#000000", category: "software", logo: "https://img.logo.dev/midjourney.com?token=demo", aliases: ["midjourney"] },
  { name: "Claude Pro", domain: "anthropic.com", color: "#D97757", category: "software", logo: "https://img.logo.dev/anthropic.com?token=demo", aliases: ["claude", "anthropic"] },
  { name: "Grammarly", domain: "grammarly.com", color: "#15C39A", category: "software", logo: "https://img.logo.dev/grammarly.com?token=demo", aliases: ["grammarly"] },
  { name: "1Password", domain: "1password.com", color: "#0094F5", category: "software", logo: "https://img.logo.dev/1password.com?token=demo", aliases: ["1password"] },
  { name: "LastPass", domain: "lastpass.com", color: "#D32D27", category: "software", logo: "https://img.logo.dev/lastpass.com?token=demo", aliases: ["lastpass"] },
  { name: "NordVPN", domain: "nordvpn.com", color: "#4687FF", category: "software", logo: "https://img.logo.dev/nordvpn.com?token=demo", aliases: ["nordvpn", "nord vpn"] },
  { name: "ExpressVPN", domain: "expressvpn.com", color: "#DA3940", category: "software", logo: "https://img.logo.dev/expressvpn.com?token=demo", aliases: ["expressvpn", "express vpn"] },

  // Productivity
  { name: "Notion", domain: "notion.so", color: "#000000", category: "productivity", logo: "https://img.logo.dev/notion.so?token=demo", aliases: ["notion"] },
  { name: "Dropbox", domain: "dropbox.com", color: "#0061FF", category: "productivity", logo: "https://img.logo.dev/dropbox.com?token=demo", aliases: ["dropbox"] },
  { name: "Google One", domain: "google.com", color: "#4285F4", category: "productivity", logo: "https://img.logo.dev/google.com?token=demo", aliases: ["google one", "google storage"] },
  { name: "Microsoft 365", domain: "microsoft.com", color: "#0078D4", category: "productivity", logo: "https://img.logo.dev/microsoft.com?token=demo", aliases: ["microsoft 365", "office 365", "microsoft office"] },
  { name: "iCloud+", domain: "icloud.com", color: "#3693F3", category: "productivity", logo: "https://img.logo.dev/icloud.com?token=demo", aliases: ["icloud", "icloud+"] },
  { name: "Slack", domain: "slack.com", color: "#4A154B", category: "productivity", logo: "https://img.logo.dev/slack.com?token=demo", aliases: ["slack"] },
  { name: "LinkedIn Premium", domain: "linkedin.com", color: "#0A66C2", category: "productivity", logo: "https://img.logo.dev/linkedin.com?token=demo", aliases: ["linkedin", "linkedin premium"] },
  { name: "Zoom", domain: "zoom.us", color: "#2D8CFF", category: "productivity", logo: "https://img.logo.dev/zoom.us?token=demo", aliases: ["zoom"] },
  { name: "Evernote", domain: "evernote.com", color: "#00A82D", category: "productivity", logo: "https://img.logo.dev/evernote.com?token=demo", aliases: ["evernote"] },
  { name: "Todoist", domain: "todoist.com", color: "#E44332", category: "productivity", logo: "https://img.logo.dev/todoist.com?token=demo", aliases: ["todoist"] },
  { name: "Trello", domain: "trello.com", color: "#0052CC", category: "productivity", logo: "https://img.logo.dev/trello.com?token=demo", aliases: ["trello"] },
  { name: "Asana", domain: "asana.com", color: "#F06A6A", category: "productivity", logo: "https://img.logo.dev/asana.com?token=demo", aliases: ["asana"] },

  // Gaming
  { name: "Xbox Game Pass", domain: "xbox.com", color: "#107C10", category: "gaming", logo: "https://img.logo.dev/xbox.com?token=demo", aliases: ["xbox", "game pass", "xbox game pass"] },
  { name: "PlayStation Plus", domain: "playstation.com", color: "#003087", category: "gaming", logo: "https://img.logo.dev/playstation.com?token=demo", aliases: ["playstation", "ps plus", "psn"] },
  { name: "Nintendo Switch Online", domain: "nintendo.com", color: "#E60012", category: "gaming", logo: "https://img.logo.dev/nintendo.com?token=demo", aliases: ["nintendo", "switch online"] },
  { name: "EA Play", domain: "ea.com", color: "#000000", category: "gaming", logo: "https://img.logo.dev/ea.com?token=demo", aliases: ["ea play", "ea access"] },
  { name: "Ubisoft+", domain: "ubisoft.com", color: "#000000", category: "gaming", logo: "https://img.logo.dev/ubisoft.com?token=demo", aliases: ["ubisoft+", "ubisoft"] },
  { name: "GeForce NOW", domain: "nvidia.com", color: "#76B900", category: "gaming", logo: "https://img.logo.dev/nvidia.com?token=demo", aliases: ["geforce now", "nvidia"] },

  // Health & Fitness
  { name: "Headspace", domain: "headspace.com", color: "#F47D31", category: "health", logo: "https://img.logo.dev/headspace.com?token=demo", aliases: ["headspace"] },
  { name: "Calm", domain: "calm.com", color: "#7FCCF7", category: "health", logo: "https://img.logo.dev/calm.com?token=demo", aliases: ["calm"] },
  { name: "Peloton", domain: "onepeloton.com", color: "#000000", category: "health", logo: "https://img.logo.dev/onepeloton.com?token=demo", aliases: ["peloton"] },
  { name: "MyFitnessPal", domain: "myfitnesspal.com", color: "#0069D1", category: "health", logo: "https://img.logo.dev/myfitnesspal.com?token=demo", aliases: ["myfitnesspal"] },
];

export const SERVICE_REGISTRY = services;

export const findService = (query: string): ServiceInfo | undefined => {
  const q = query.toLowerCase().trim().replace(/[^a-z0-9\s+.]/g, "");
  return services.find(
    (s) =>
      s.name.toLowerCase() === q ||
      s.domain.replace(".com", "").replace(".so", "").replace(".tv", "") === q ||
      s.aliases.some((a) => q.includes(a) || a.includes(q))
  );
};

export const searchServices = (query: string): ServiceInfo[] => {
  if (!query.trim()) return services;
  const q = query.toLowerCase().trim();
  return services.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.domain.toLowerCase().includes(q) ||
      s.aliases.some((a) => a.includes(q) || q.includes(a))
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
