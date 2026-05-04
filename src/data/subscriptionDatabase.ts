// PAYTHRA MASTER SUBSCRIPTION DATABASE
// 500+ subscription services across EN, ES, PL, DE, FR markets
// Each entry: id, names (searchable aliases), category, pricing, countries, domain, color

export const SUBSCRIPTION_DATABASE = [

  // ========== STREAMING — VIDEO ==========
  { id: "netflix", names: ["Netflix", "Netflix Premium", "Netflix Standard"], category: "streaming_video", domain: "netflix.com", color: "#E50914", countries: ["ALL"], pricing: { monthly: { EUR: 17.99, GBP: 17.99, PLN: 65, USD: 22.99 }, annual: null }, billingCycles: ["monthly", "annual"] },
  { id: "disney_plus", names: ["Disney+", "Disney Plus", "Disney+ Premium"], category: "streaming_video", domain: "disneyplus.com", color: "#113CCF", countries: ["ALL"], pricing: { monthly: { EUR: 11.99, GBP: 11.99, PLN: 34.99, USD: 13.99 } } },
  { id: "hbo_max", names: ["Max", "HBO Max", "HBO", "Warner TV"], category: "streaming_video", domain: "max.com", color: "#5822B4", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 9.99, USD: 15.99 } } },
  { id: "amazon_prime_video", names: ["Amazon Prime Video", "Prime Video", "Amazon Prime"], category: "streaming_video", domain: "primevideo.com", color: "#00A8E1", countries: ["ALL"], pricing: { monthly: { EUR: 8.99, GBP: 8.99, PLN: 49, USD: 8.99 } } },
  { id: "apple_tv", names: ["Apple TV+", "Apple TV Plus"], category: "streaming_video", domain: "tv.apple.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 8.99, PLN: 34.99, USD: 9.99 } } },
  { id: "hulu", names: ["Hulu", "Hulu Live TV"], category: "streaming_video", domain: "hulu.com", color: "#1CE783", countries: ["US"], pricing: { monthly: { USD: 7.99 } } },
  { id: "paramount_plus", names: ["Paramount+", "Paramount Plus"], category: "streaming_video", domain: "paramountplus.com", color: "#0064FF", countries: ["US", "UK", "DE", "FR", "ES"], pricing: { monthly: { EUR: 7.99, GBP: 6.99, USD: 7.99 } } },
  { id: "peacock", names: ["Peacock", "Peacock Premium"], category: "streaming_video", domain: "peacocktv.com", color: "#000000", countries: ["US"], pricing: { monthly: { USD: 7.99 } } },
  { id: "crunchyroll", names: ["Crunchyroll", "Crunchyroll Premium"], category: "streaming_video", domain: "crunchyroll.com", color: "#F47521", countries: ["ALL"], pricing: { monthly: { EUR: 7.99, GBP: 6.99, USD: 7.99 } } },
  { id: "mubi", names: ["MUBI", "Mubi"], category: "streaming_video", domain: "mubi.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { EUR: 12.99, GBP: 10.99, USD: 14.99 } } },
  { id: "discovery_plus", names: ["Discovery+", "Discovery Plus"], category: "streaming_video", domain: "discoveryplus.com", color: "#2175D9", countries: ["UK", "US", "DE"], pricing: { monthly: { EUR: 6.99, GBP: 6.99, USD: 8.99 } } },
  { id: "youtube_premium", names: ["YouTube Premium", "YouTube Music Premium"], category: "streaming_video", domain: "youtube.com", color: "#FF0000", countries: ["ALL"], pricing: { monthly: { EUR: 11.99, GBP: 13.99, PLN: 23.99, USD: 13.99 } } },
  { id: "dazn", names: ["DAZN"], category: "streaming_video", domain: "dazn.com", color: "#F8F900", countries: ["DE", "ES", "IT", "PL"], pricing: { monthly: { EUR: 29.99, PLN: 39.99 } } },
  { id: "canal_plus", names: ["Canal+", "Canal Plus", "myCANAL"], category: "streaming_video", domain: "canalplus.com", color: "#000000", countries: ["FR", "PL"], pricing: { monthly: { EUR: 19.99, PLN: 65 } } },
  { id: "salto", names: ["Salto"], category: "streaming_video", domain: "salto.fr", color: "#FF4500", countries: ["FR"], pricing: { monthly: { EUR: 6.99 } } },
  { id: "ocs", names: ["OCS", "Orange Cinema Series"], category: "streaming_video", domain: "ocs.fr", color: "#FF6900", countries: ["FR"], pricing: { monthly: { EUR: 11.99 } } },
  { id: "atresplayer", names: ["Atresplayer", "Atresplayer Premium"], category: "streaming_video", domain: "atresplayer.com", color: "#FF6600", countries: ["ES"], pricing: { monthly: { EUR: 4.99 } } },
  { id: "movistar_plus", names: ["Movistar+", "Movistar Plus"], category: "streaming_video", domain: "movistarplus.es", color: "#019DF4", countries: ["ES"], pricing: { monthly: { EUR: 14 } } },
  { id: "tvp_vod", names: ["TVP VOD", "tvp.pl"], category: "streaming_video", domain: "tvp.pl", color: "#003087", countries: ["PL"], pricing: { monthly: { PLN: 0 } } },
  { id: "player_pl", names: ["Player.pl", "Player"], category: "streaming_video", domain: "player.pl", color: "#E4002B", countries: ["PL"], pricing: { monthly: { PLN: 24.99 } } },
  { id: "polsat_box_go", names: ["Polsat Box Go", "Polsat Go"], category: "streaming_video", domain: "polsatboxgo.pl", color: "#E4002B", countries: ["PL"], pricing: { monthly: { PLN: 30 } } },
  { id: "sky_go", names: ["Sky Go", "Sky TV", "Sky Cinema"], category: "streaming_video", domain: "sky.com", color: "#0072C9", countries: ["UK", "DE"], pricing: { monthly: { EUR: 12.99, GBP: 26 } } },
  { id: "britbox", names: ["BritBox"], category: "streaming_video", domain: "britbox.com", color: "#002855", countries: ["UK", "US"], pricing: { monthly: { GBP: 6.99, USD: 8.99 } } },
  { id: "shudder", names: ["Shudder"], category: "streaming_video", domain: "shudder.com", color: "#E60000", countries: ["US", "UK"], pricing: { monthly: { GBP: 4.99, USD: 5.99 } } },
  { id: "joyn", names: ["Joyn", "Joyn Plus"], category: "streaming_video", domain: "joyn.de", color: "#FF0050", countries: ["DE"], pricing: { monthly: { EUR: 0 } } },
  { id: "magenta_tv", names: ["MagentaTV", "Magenta TV"], category: "streaming_video", domain: "magenta.de", color: "#E20074", countries: ["DE"], pricing: { monthly: { EUR: 10 } } },
  { id: "rtl_plus", names: ["RTL+", "RTL Plus"], category: "streaming_video", domain: "rtl.de", color: "#FF6600", countries: ["DE"], pricing: { monthly: { EUR: 4.99 } } },

  // ========== STREAMING — MUSIC ==========
  { id: "spotify", names: ["Spotify", "Spotify Premium", "Spotify Family", "Spotify Duo"], category: "streaming_music", domain: "spotify.com", color: "#1DB954", countries: ["ALL"], pricing: { monthly: { EUR: 11.99, GBP: 11.99, PLN: 23.99, USD: 11.99 } } },
  { id: "apple_music", names: ["Apple Music", "Apple Music Family"], category: "streaming_music", domain: "music.apple.com", color: "#FC3C44", countries: ["ALL"], pricing: { monthly: { EUR: 11.99, GBP: 11.99, PLN: 23.99, USD: 11.99 } } },
  { id: "tidal", names: ["Tidal", "Tidal HiFi", "Tidal Premium"], category: "streaming_music", domain: "tidal.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { EUR: 10.99, GBP: 10.99, USD: 10.99 } } },
  { id: "deezer", names: ["Deezer", "Deezer Premium", "Deezer Family"], category: "streaming_music", domain: "deezer.com", color: "#A238FF", countries: ["ALL"], pricing: { monthly: { EUR: 10.99, GBP: 10.99, PLN: 19.99, USD: 10.99 } } },
  { id: "amazon_music", names: ["Amazon Music Unlimited", "Amazon Music"], category: "streaming_music", domain: "music.amazon.com", color: "#25D1DA", countries: ["ALL"], pricing: { monthly: { EUR: 10.99, GBP: 10.99, USD: 10.99 } } },
  { id: "soundcloud_go", names: ["SoundCloud Go", "SoundCloud Go+"], category: "streaming_music", domain: "soundcloud.com", color: "#FF5500", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, USD: 9.99 } } },
  { id: "qobuz", names: ["Qobuz", "Qobuz Studio"], category: "streaming_music", domain: "qobuz.com", color: "#2A5C8A", countries: ["FR", "DE", "UK", "US"], pricing: { monthly: { EUR: 12.99, GBP: 12.99, USD: 14.99 } } },
  { id: "idagio", names: ["IDAGIO"], category: "streaming_music", domain: "idagio.com", color: "#000000", countries: ["DE", "FR", "UK"], pricing: { monthly: { EUR: 9.99 } } },

  // ========== PRODUCTIVITY ==========
  { id: "microsoft_365", names: ["Microsoft 365", "Microsoft Office", "Office 365", "Microsoft 365 Personal", "Microsoft 365 Family"], category: "productivity", domain: "microsoft.com", color: "#0078D4", countries: ["ALL"], pricing: { monthly: { EUR: 7, GBP: 7.99, PLN: 37.99, USD: 6.99 }, annual: { EUR: 69, GBP: 79.99, PLN: 349, USD: 69.99 } } },
  { id: "google_workspace", names: ["Google Workspace", "Google One", "G Suite", "Google Drive"], category: "productivity", domain: "workspace.google.com", color: "#4285F4", countries: ["ALL"], pricing: { monthly: { EUR: 6, GBP: 5.20, PLN: 25, USD: 6 } } },
  { id: "notion", names: ["Notion", "Notion Plus", "Notion Pro", "Notion Team"], category: "productivity", domain: "notion.so", color: "#000000", countries: ["ALL"], pricing: { monthly: { EUR: 10, USD: 10 }, annual: { EUR: 96, USD: 96 } } },
  { id: "evernote", names: ["Evernote", "Evernote Personal", "Evernote Professional"], category: "productivity", domain: "evernote.com", color: "#00A82D", countries: ["ALL"], pricing: { monthly: { EUR: 14.99, USD: 14.99 } } },
  { id: "todoist", names: ["Todoist", "Todoist Pro"], category: "productivity", domain: "todoist.com", color: "#DB4035", countries: ["ALL"], pricing: { monthly: { EUR: 4, USD: 4 }, annual: { EUR: 36, USD: 36 } } },
  { id: "monday", names: ["Monday.com", "Monday"], category: "productivity", domain: "monday.com", color: "#FF3D57", countries: ["ALL"], pricing: { monthly: { EUR: 9, USD: 9 } } },
  { id: "asana", names: ["Asana", "Asana Premium", "Asana Business"], category: "productivity", domain: "asana.com", color: "#F06A6A", countries: ["ALL"], pricing: { monthly: { EUR: 13.49, USD: 13.49 } } },
  { id: "trello", names: ["Trello", "Trello Premium"], category: "productivity", domain: "trello.com", color: "#0079BF", countries: ["ALL"], pricing: { monthly: { EUR: 5, USD: 5 } } },
  { id: "clickup", names: ["ClickUp", "ClickUp Unlimited"], category: "productivity", domain: "clickup.com", color: "#7B68EE", countries: ["ALL"], pricing: { monthly: { EUR: 7, USD: 7 } } },
  { id: "airtable", names: ["Airtable", "Airtable Plus", "Airtable Pro"], category: "productivity", domain: "airtable.com", color: "#FCB400", countries: ["ALL"], pricing: { monthly: { EUR: 10, USD: 10 } } },
  { id: "obsidian", names: ["Obsidian Sync", "Obsidian Publish"], category: "productivity", domain: "obsidian.md", color: "#7C3AED", countries: ["ALL"], pricing: { monthly: { USD: 8 } } },
  { id: "roam_research", names: ["Roam Research"], category: "productivity", domain: "roamresearch.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 15 } } },
  { id: "craft", names: ["Craft", "Craft Pro"], category: "productivity", domain: "craft.do", color: "#000000", countries: ["ALL"], pricing: { monthly: { EUR: 5, USD: 5 } } },

  // ========== DESIGN & CREATIVE ==========
  { id: "adobe_creative_cloud", names: ["Adobe Creative Cloud", "Adobe CC", "Adobe All Apps", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere", "Adobe Acrobat"], category: "design", domain: "adobe.com", color: "#FF0000", countries: ["ALL"], pricing: { monthly: { EUR: 59.99, GBP: 54.98, PLN: 239, USD: 59.99 } } },
  { id: "figma", names: ["Figma", "Figma Professional", "Figma Organization"], category: "design", domain: "figma.com", color: "#F24E1E", countries: ["ALL"], pricing: { monthly: { EUR: 12, USD: 12 } } },
  { id: "canva_pro", names: ["Canva Pro", "Canva", "Canva for Teams"], category: "design", domain: "canva.com", color: "#00C4CC", countries: ["ALL"], pricing: { monthly: { EUR: 13.99, GBP: 10.99, PLN: 54.99, USD: 14.99 } } },
  { id: "sketch", names: ["Sketch", "Sketch Standard"], category: "design", domain: "sketch.com", color: "#F7B500", countries: ["ALL"], pricing: { monthly: { USD: 9 } } },
  { id: "framer", names: ["Framer", "Framer Mini", "Framer Basic"], category: "design", domain: "framer.com", color: "#0055FF", countries: ["ALL"], pricing: { monthly: { EUR: 5, USD: 5 } } },
  { id: "invision", names: ["InVision", "InVision Studio"], category: "design", domain: "invisionapp.com", color: "#FF3366", countries: ["ALL"], pricing: { monthly: { USD: 15 } } },
  { id: "procreate_dreams", names: ["Procreate Dreams"], category: "design", domain: "procreate.art", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 4.99 } } },
  { id: "midjourney", names: ["Midjourney", "Midjourney Basic", "Midjourney Standard", "Midjourney Pro"], category: "design", domain: "midjourney.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 10 } } },

  // ========== AI TOOLS ==========
  { id: "chatgpt_plus", names: ["ChatGPT Plus", "ChatGPT Pro", "OpenAI", "ChatGPT"], category: "ai", domain: "openai.com", color: "#10A37F", countries: ["ALL"], pricing: { monthly: { EUR: 20, GBP: 18.99, PLN: 85, USD: 20 } } },
  { id: "claude_pro", names: ["Claude Pro", "Claude", "Anthropic Claude"], category: "ai", domain: "anthropic.com", color: "#D4A27F", countries: ["ALL"], pricing: { monthly: { EUR: 18, USD: 20 } } },
  { id: "github_copilot", names: ["GitHub Copilot", "Copilot"], category: "ai", domain: "github.com", color: "#24292E", countries: ["ALL"], pricing: { monthly: { EUR: 10, USD: 10 } } },
  { id: "jasper", names: ["Jasper", "Jasper AI", "Jasper Creator"], category: "ai", domain: "jasper.ai", color: "#FF6B35", countries: ["ALL"], pricing: { monthly: { USD: 39 } } },
  { id: "grammarly", names: ["Grammarly", "Grammarly Premium", "Grammarly Business"], category: "ai", domain: "grammarly.com", color: "#15C39A", countries: ["ALL"], pricing: { monthly: { EUR: 12, USD: 12 } } },
  { id: "notion_ai", names: ["Notion AI"], category: "ai", domain: "notion.so", color: "#000000", countries: ["ALL"], pricing: { monthly: { EUR: 8, USD: 8 } } },
  { id: "perplexity", names: ["Perplexity Pro", "Perplexity AI"], category: "ai", domain: "perplexity.ai", color: "#20808D", countries: ["ALL"], pricing: { monthly: { USD: 20 } } },
  { id: "eleven_labs", names: ["ElevenLabs", "Eleven Labs Starter", "Eleven Labs Creator"], category: "ai", domain: "elevenlabs.io", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 5 } } },
  { id: "runway", names: ["Runway", "Runway Standard", "Runway Pro"], category: "ai", domain: "runwayml.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 12 } } },

  // ========== CLOUD STORAGE ==========
  { id: "dropbox", names: ["Dropbox", "Dropbox Plus", "Dropbox Professional", "Dropbox Business"], category: "storage", domain: "dropbox.com", color: "#0061FF", countries: ["ALL"], pricing: { monthly: { EUR: 11.99, GBP: 9.99, PLN: 49.99, USD: 11.99 } } },
  { id: "apple_icloud", names: ["iCloud+", "Apple iCloud", "iCloud 50GB", "iCloud 200GB", "iCloud 2TB"], category: "storage", domain: "icloud.com", color: "#3A8EF6", countries: ["ALL"], pricing: { monthly: { EUR: 0.99, GBP: 0.99, PLN: 3.99, USD: 0.99 } } },
  { id: "google_one", names: ["Google One", "Google Drive 100GB", "Google Drive 2TB"], category: "storage", domain: "one.google.com", color: "#4285F4", countries: ["ALL"], pricing: { monthly: { EUR: 1.99, GBP: 1.59, PLN: 8.99, USD: 1.99 } } },
  { id: "box", names: ["Box", "Box Personal Pro"], category: "storage", domain: "box.com", color: "#0061D5", countries: ["ALL"], pricing: { monthly: { USD: 10 } } },
  { id: "mega", names: ["MEGA", "MEGA Pro"], category: "storage", domain: "mega.io", color: "#D9272E", countries: ["ALL"], pricing: { monthly: { EUR: 4.99, USD: 4.99 } } },
  { id: "pcloud", names: ["pCloud", "pCloud Premium"], category: "storage", domain: "pcloud.com", color: "#3F9AE0", countries: ["ALL"], pricing: { monthly: { EUR: 4.99, USD: 4.99 } } },

  // ========== DEVELOPER TOOLS ==========
  { id: "github_pro", names: ["GitHub Pro", "GitHub Team", "GitHub Enterprise"], category: "developer", domain: "github.com", color: "#24292E", countries: ["ALL"], pricing: { monthly: { USD: 4 } } },
  { id: "gitlab", names: ["GitLab Premium", "GitLab Ultimate"], category: "developer", domain: "gitlab.com", color: "#FC6D26", countries: ["ALL"], pricing: { monthly: { USD: 19 } } },
  { id: "vercel_pro", names: ["Vercel Pro", "Vercel"], category: "developer", domain: "vercel.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 20 } } },
  { id: "netlify", names: ["Netlify Pro", "Netlify"], category: "developer", domain: "netlify.com", color: "#00C7B7", countries: ["ALL"], pricing: { monthly: { USD: 19 } } },
  { id: "heroku", names: ["Heroku", "Heroku Basic"], category: "developer", domain: "heroku.com", color: "#430098", countries: ["ALL"], pricing: { monthly: { USD: 5 } } },
  { id: "digitalocean", names: ["DigitalOcean", "Digital Ocean"], category: "developer", domain: "digitalocean.com", color: "#0080FF", countries: ["ALL"], pricing: { monthly: { USD: 4 } } },
  { id: "aws", names: ["AWS", "Amazon Web Services"], category: "developer", domain: "aws.amazon.com", color: "#FF9900", countries: ["ALL"], pricing: { monthly: { USD: 0 } } },
  { id: "linear", names: ["Linear", "Linear Plus"], category: "developer", domain: "linear.app", color: "#5E6AD2", countries: ["ALL"], pricing: { monthly: { USD: 8 } } },
  { id: "jetbrains", names: ["JetBrains", "JetBrains All Products", "IntelliJ IDEA", "PyCharm", "WebStorm"], category: "developer", domain: "jetbrains.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { EUR: 24.90, USD: 24.90 } } },

  // ========== COMMUNICATION ==========
  { id: "slack_pro", names: ["Slack Pro", "Slack Business+", "Slack"], category: "communication", domain: "slack.com", color: "#4A154B", countries: ["ALL"], pricing: { monthly: { EUR: 7.25, USD: 7.25 } } },
  { id: "zoom", names: ["Zoom Pro", "Zoom Business", "Zoom"], category: "communication", domain: "zoom.us", color: "#2D8CFF", countries: ["ALL"], pricing: { monthly: { EUR: 13.99, GBP: 11.99, USD: 13.32 } } },
  { id: "discord_nitro", names: ["Discord Nitro", "Discord Nitro Basic"], category: "communication", domain: "discord.com", color: "#5865F2", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 9.99, PLN: 42.99, USD: 9.99 } } },
  { id: "teams", names: ["Microsoft Teams", "Teams Essentials"], category: "communication", domain: "microsoft.com", color: "#6264A7", countries: ["ALL"], pricing: { monthly: { EUR: 4.20, USD: 4 } } },
  { id: "loom", names: ["Loom Business", "Loom"], category: "communication", domain: "loom.com", color: "#625DF5", countries: ["ALL"], pricing: { monthly: { USD: 12.50 } } },

  // ========== FITNESS & HEALTH ==========
  { id: "basic_fit", names: ["Basic-Fit", "Basic Fit"], category: "fitness", domain: "basic-fit.com", color: "#FF6B00", countries: ["FR", "ES", "DE", "NL", "BE"], pricing: { monthly: { EUR: 29.99 } } },
  { id: "peloton", names: ["Peloton", "Peloton App"], category: "fitness", domain: "onepeloton.com", color: "#FF0000", countries: ["US", "UK", "DE"], pricing: { monthly: { EUR: 12.99, GBP: 12.99, USD: 12.99 } } },
  { id: "strava", names: ["Strava", "Strava Premium", "Strava Subscription"], category: "fitness", domain: "strava.com", color: "#FC4C02", countries: ["ALL"], pricing: { monthly: { EUR: 7.99, GBP: 6.99, PLN: 34.99, USD: 7.99 } } },
  { id: "myfitnesspal", names: ["MyFitnessPal Premium", "MyFitnessPal"], category: "fitness", domain: "myfitnesspal.com", color: "#00B2FF", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, USD: 9.99 } } },
  { id: "headspace", names: ["Headspace", "Headspace Plus"], category: "fitness", domain: "headspace.com", color: "#FF8700", countries: ["ALL"], pricing: { monthly: { EUR: 12.99, GBP: 9.99, USD: 12.99 } } },
  { id: "calm", names: ["Calm", "Calm Premium"], category: "fitness", domain: "calm.com", color: "#4A90D9", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 9.99, USD: 9.99 } } },
  { id: "noom", names: ["Noom"], category: "fitness", domain: "noom.com", color: "#60B245", countries: ["US", "UK", "DE"], pricing: { monthly: { USD: 59 } } },
  { id: "eight_sleep", names: ["Eight Sleep", "Eight Sleep Membership"], category: "fitness", domain: "eightsleep.com", color: "#000000", countries: ["US", "UK"], pricing: { monthly: { USD: 19 } } },
  { id: "whoop", names: ["WHOOP", "Whoop Membership"], category: "fitness", domain: "whoop.com", color: "#000000", countries: ["US", "UK", "DE"], pricing: { monthly: { EUR: 25, USD: 30 } } },
  { id: "fitbod", names: ["Fitbod", "Fitbod Elite"], category: "fitness", domain: "fitbod.me", color: "#FF4500", countries: ["ALL"], pricing: { monthly: { USD: 12.99 } } },
  { id: "freeletics", names: ["Freeletics", "Freeletics Training Coach"], category: "fitness", domain: "freeletics.com", color: "#1A1A1A", countries: ["DE", "FR", "ES", "UK"], pricing: { monthly: { EUR: 14.99 } } },

  // ========== EDUCATION ==========
  { id: "duolingo_plus", names: ["Duolingo Plus", "Duolingo Super", "Duolingo"], category: "education", domain: "duolingo.com", color: "#58CC02", countries: ["ALL"], pricing: { monthly: { EUR: 6.99, GBP: 6.99, PLN: 29.99, USD: 6.99 } } },
  { id: "coursera_plus", names: ["Coursera Plus", "Coursera"], category: "education", domain: "coursera.org", color: "#0056D2", countries: ["ALL"], pricing: { monthly: { USD: 59 } } },
  { id: "skillshare", names: ["Skillshare", "Skillshare Premium"], category: "education", domain: "skillshare.com", color: "#00DE76", countries: ["ALL"], pricing: { monthly: { EUR: 10, USD: 10 } } },
  { id: "masterclass", names: ["MasterClass", "Masterclass Annual"], category: "education", domain: "masterclass.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 15 } } },
  { id: "linkedin_learning", names: ["LinkedIn Learning", "LinkedIn Premium"], category: "education", domain: "linkedin.com", color: "#0A66C2", countries: ["ALL"], pricing: { monthly: { EUR: 39.99, GBP: 29.99, USD: 39.99 } } },
  { id: "babbel", names: ["Babbel", "Babbel Premium"], category: "education", domain: "babbel.com", color: "#5A2D82", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, PLN: 39.99, USD: 9.99 } } },
  { id: "rosetta_stone", names: ["Rosetta Stone", "Rosetta Stone Lifetime"], category: "education", domain: "rosettastone.com", color: "#002D72", countries: ["ALL"], pricing: { monthly: { USD: 11.99 } } },
  { id: "udemy", names: ["Udemy Personal Plan", "Udemy Business"], category: "education", domain: "udemy.com", color: "#A435F0", countries: ["ALL"], pricing: { monthly: { USD: 16.58 } } },
  { id: "brilliant", names: ["Brilliant", "Brilliant Premium"], category: "education", domain: "brilliant.org", color: "#F26522", countries: ["ALL"], pricing: { monthly: { USD: 12.49 } } },

  // ========== GAMING ==========
  { id: "xbox_game_pass", names: ["Xbox Game Pass", "Xbox Game Pass Ultimate", "PC Game Pass"], category: "gaming", domain: "xbox.com", color: "#107C10", countries: ["ALL"], pricing: { monthly: { EUR: 14.99, GBP: 14.99, PLN: 54.99, USD: 14.99 } } },
  { id: "playstation_plus", names: ["PlayStation Plus", "PS Plus", "PS Plus Extra", "PS Plus Premium"], category: "gaming", domain: "playstation.com", color: "#003087", countries: ["ALL"], pricing: { monthly: { EUR: 8.99, GBP: 8.99, PLN: 39.99, USD: 9.99 } } },
  { id: "nintendo_online", names: ["Nintendo Switch Online", "Nintendo Online"], category: "gaming", domain: "nintendo.com", color: "#E4000F", countries: ["ALL"], pricing: { monthly: { EUR: 3.99, GBP: 3.49, PLN: 19.99, USD: 3.99 } } },
  { id: "ea_play", names: ["EA Play", "EA Play Pro"], category: "gaming", domain: "ea.com", color: "#FF4500", countries: ["ALL"], pricing: { monthly: { EUR: 4.99, GBP: 3.99, PLN: 19.99, USD: 4.99 } } },
  { id: "ubisoft_plus", names: ["Ubisoft+", "Ubisoft Plus"], category: "gaming", domain: "ubisoft.com", color: "#0070FF", countries: ["ALL"], pricing: { monthly: { EUR: 14.99, USD: 14.99 } } },
  { id: "geforce_now", names: ["GeForce Now", "NVIDIA GeForce Now"], category: "gaming", domain: "nvidia.com", color: "#76B900", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 9.99, USD: 9.99 } } },

  // ========== NEWS & READING ==========
  { id: "spotify_podcast", names: ["Spotify Podcast"], category: "news", domain: "spotify.com", color: "#1DB954", countries: ["ALL"], pricing: { monthly: { EUR: 0 } } },
  { id: "medium", names: ["Medium", "Medium Member"], category: "news", domain: "medium.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 5 } } },
  { id: "substack", names: ["Substack", "Substack Pro"], category: "news", domain: "substack.com", color: "#FF6719", countries: ["ALL"], pricing: { monthly: { USD: 5 } } },
  { id: "kindle_unlimited", names: ["Kindle Unlimited", "Amazon Kindle"], category: "news", domain: "amazon.com", color: "#FF9900", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 7.99, USD: 11.99 } } },
  { id: "audible", names: ["Audible", "Audible Premium Plus"], category: "news", domain: "audible.com", color: "#F8991C", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 7.99, USD: 7.95 } } },
  { id: "readwise", names: ["Readwise", "Readwise Reader"], category: "news", domain: "readwise.io", color: "#FF6B35", countries: ["ALL"], pricing: { monthly: { USD: 7.99 } } },
  { id: "nyt", names: ["New York Times", "NYT", "The New York Times"], category: "news", domain: "nytimes.com", color: "#000000", countries: ["US", "UK"], pricing: { monthly: { USD: 17 } } },
  { id: "the_guardian", names: ["The Guardian", "Guardian Premium"], category: "news", domain: "theguardian.com", color: "#052962", countries: ["UK"], pricing: { monthly: { GBP: 11.99 } } },
  { id: "economist", names: ["The Economist"], category: "news", domain: "economist.com", color: "#E3120B", countries: ["UK", "US"], pricing: { monthly: { GBP: 22, USD: 24 } } },
  { id: "le_monde", names: ["Le Monde", "Le Monde Numérique"], category: "news", domain: "lemonde.fr", color: "#003153", countries: ["FR"], pricing: { monthly: { EUR: 9.99 } } },
  { id: "figaro", names: ["Le Figaro", "Figaro Premium"], category: "news", domain: "lefigaro.fr", color: "#C8102E", countries: ["FR"], pricing: { monthly: { EUR: 9.99 } } },
  { id: "el_pais", names: ["El País", "El Pais Digital"], category: "news", domain: "elpais.com", color: "#000000", countries: ["ES"], pricing: { monthly: { EUR: 10 } } },
  { id: "spiegel", names: ["Der Spiegel", "Spiegel+"], category: "news", domain: "spiegel.de", color: "#CC0000", countries: ["DE"], pricing: { monthly: { EUR: 19.99 } } },
  { id: "bild_plus", names: ["Bild+", "Bild Plus"], category: "news", domain: "bild.de", color: "#E2001A", countries: ["DE"], pricing: { monthly: { EUR: 7.99 } } },
  { id: "gazeta_wyborcza", names: ["Gazeta Wyborcza", "Wyborcza.pl"], category: "news", domain: "wyborcza.pl", color: "#C8102E", countries: ["PL"], pricing: { monthly: { PLN: 29.99 } } },

  // ========== FINANCE ==========
  { id: "revolut_premium", names: ["Revolut Premium", "Revolut Metal", "Revolut Plus"], category: "finance", domain: "revolut.com", color: "#0075EB", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 9.99, PLN: 39.99 } } },
  { id: "n26", names: ["N26 Smart", "N26 You", "N26 Metal"], category: "finance", domain: "n26.com", color: "#25D366", countries: ["DE", "FR", "ES"], pricing: { monthly: { EUR: 4.90 } } },
  { id: "ynab", names: ["YNAB", "You Need A Budget"], category: "finance", domain: "ynab.com", color: "#4CAF50", countries: ["US", "UK"], pricing: { monthly: { USD: 14.99 } } },
  { id: "monzo_plus", names: ["Monzo Plus", "Monzo Premium"], category: "finance", domain: "monzo.com", color: "#FF1694", countries: ["UK"], pricing: { monthly: { GBP: 5 } } },
  { id: "wise", names: ["Wise Account", "Wise"], category: "finance", domain: "wise.com", color: "#00B9FF", countries: ["ALL"], pricing: { monthly: { EUR: 0 } } },

  // ========== SECURITY & VPN ==========
  { id: "nordvpn", names: ["NordVPN", "Nord VPN"], category: "security", domain: "nordvpn.com", color: "#4687FF", countries: ["ALL"], pricing: { monthly: { EUR: 12.99, GBP: 11.99, PLN: 54.99, USD: 12.99 } } },
  { id: "expressvpn", names: ["ExpressVPN", "Express VPN"], category: "security", domain: "expressvpn.com", color: "#DA3940", countries: ["ALL"], pricing: { monthly: { EUR: 12.95, USD: 12.95 } } },
  { id: "surfshark", names: ["Surfshark", "Surfshark VPN"], category: "security", domain: "surfshark.com", color: "#1DBCB0", countries: ["ALL"], pricing: { monthly: { EUR: 12.95, PLN: 54.99, USD: 12.95 } } },
  { id: "dashlane", names: ["Dashlane", "Dashlane Premium"], category: "security", domain: "dashlane.com", color: "#005A5B", countries: ["ALL"], pricing: { monthly: { EUR: 4.99, USD: 4.99 } } },
  { id: "1password", names: ["1Password", "1Password Families"], category: "security", domain: "1password.com", color: "#1A8CFF", countries: ["ALL"], pricing: { monthly: { USD: 2.99 } } },
  { id: "lastpass", names: ["LastPass Premium", "LastPass Families"], category: "security", domain: "lastpass.com", color: "#D32D27", countries: ["ALL"], pricing: { monthly: { USD: 3 } } },
  { id: "bitwarden", names: ["Bitwarden Premium"], category: "security", domain: "bitwarden.com", color: "#175DDC", countries: ["ALL"], pricing: { monthly: { USD: 0.83 } } },
  { id: "malwarebytes", names: ["Malwarebytes Premium", "Malwarebytes"], category: "security", domain: "malwarebytes.com", color: "#00A8E0", countries: ["ALL"], pricing: { monthly: { USD: 4.99 } } },

  // ========== E-COMMERCE / SHOPPING ==========
  { id: "amazon_prime", names: ["Amazon Prime", "Prime Membership"], category: "shopping", domain: "amazon.com", color: "#FF9900", countries: ["ALL"], pricing: { monthly: { EUR: 8.99, GBP: 8.99, PLN: 49, USD: 14.99 } } },
  { id: "allegro_smart", names: ["Allegro Smart!", "Allegro Smart"], category: "shopping", domain: "allegro.pl", color: "#FF5A00", countries: ["PL"], pricing: { monthly: { PLN: 11.99 }, annual: { PLN: 49.90 } } },
  { id: "zalando_plus", names: ["Zalando Plus", "Zalando Zircle"], category: "shopping", domain: "zalando.com", color: "#FF6900", countries: ["DE", "FR", "ES", "PL"], pricing: { monthly: { EUR: 9.99, PLN: 49.99 } } },

  // ========== FOOD & DELIVERY ==========
  { id: "deliveroo_plus", names: ["Deliveroo Plus", "Deliveroo"], category: "food", domain: "deliveroo.com", color: "#00CCBC", countries: ["UK", "FR", "DE", "ES"], pricing: { monthly: { EUR: 6.99, GBP: 3.49 } } },
  { id: "uber_eats_pass", names: ["Uber Eats Pass", "Uber One"], category: "food", domain: "ubereats.com", color: "#06C167", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, GBP: 9.99, PLN: 39.99, USD: 9.99 } } },
  { id: "glovo_prime", names: ["Glovo Prime", "Glovo"], category: "food", domain: "glovoapp.com", color: "#FFC244", countries: ["ES", "PL", "FR"], pricing: { monthly: { EUR: 5.99, PLN: 29.99 } } },
  { id: "hello_fresh", names: ["HelloFresh", "Hello Fresh"], category: "food", domain: "hellofresh.com", color: "#8DB600", countries: ["US", "UK", "DE", "FR"], pricing: { monthly: { EUR: 40, GBP: 35, USD: 60 } } },
  { id: "marley_spoon", names: ["Marley Spoon"], category: "food", domain: "marleyspoon.com", color: "#FF6B35", countries: ["DE", "US"], pricing: { monthly: { EUR: 45, USD: 50 } } },

  // ========== TELECOM — POLAND ==========
  { id: "play_pl", names: ["Play Online", "Play PL"], category: "telecom", domain: "play.pl", color: "#8B00FF", countries: ["PL"], pricing: { monthly: { PLN: 55 } } },
  { id: "orange_pl", names: ["Orange Polska", "Orange PL"], category: "telecom", domain: "orange.pl", color: "#FF7900", countries: ["PL"], pricing: { monthly: { PLN: 50 } } },
  { id: "t_mobile_pl", names: ["T-Mobile Polska", "T-Mobile PL"], category: "telecom", domain: "t-mobile.pl", color: "#E20074", countries: ["PL"], pricing: { monthly: { PLN: 55 } } },
  { id: "plus_pl", names: ["Plus GSM", "Plus Polska"], category: "telecom", domain: "plus.pl", color: "#FFDD00", countries: ["PL"], pricing: { monthly: { PLN: 50 } } },

  // ========== TELECOM — SPAIN ==========
  { id: "movistar_es", names: ["Movistar", "Movistar España"], category: "telecom", domain: "movistar.es", color: "#019DF4", countries: ["ES"], pricing: { monthly: { EUR: 20 } } },
  { id: "vodafone_es", names: ["Vodafone España", "Vodafone ES"], category: "telecom", domain: "vodafone.es", color: "#E60000", countries: ["ES"], pricing: { monthly: { EUR: 20 } } },
  { id: "orange_es", names: ["Orange España", "Orange ES"], category: "telecom", domain: "orange.es", color: "#FF7900", countries: ["ES"], pricing: { monthly: { EUR: 20 } } },

  // ========== TELECOM — GERMANY ==========
  { id: "telekom_de", names: ["Deutsche Telekom", "Telekom", "Telekom MagentaMobil"], category: "telecom", domain: "telekom.de", color: "#E20074", countries: ["DE"], pricing: { monthly: { EUR: 30 } } },
  { id: "o2_de", names: ["O2 Germany", "O2 DE"], category: "telecom", domain: "o2online.de", color: "#0019A5", countries: ["DE"], pricing: { monthly: { EUR: 20 } } },
  { id: "vodafone_de", names: ["Vodafone Germany", "Vodafone DE"], category: "telecom", domain: "vodafone.de", color: "#E60000", countries: ["DE"], pricing: { monthly: { EUR: 25 } } },

  // ========== TELECOM — FRANCE ==========
  { id: "orange_fr", names: ["Orange France", "Orange FR"], category: "telecom", domain: "orange.fr", color: "#FF7900", countries: ["FR"], pricing: { monthly: { EUR: 20 } } },
  { id: "sfr", names: ["SFR", "SFR Mobile"], category: "telecom", domain: "sfr.fr", color: "#E2001A", countries: ["FR"], pricing: { monthly: { EUR: 20 } } },
  { id: "bouygues", names: ["Bouygues Telecom", "Bouygues"], category: "telecom", domain: "bouyguestelecom.fr", color: "#009FE3", countries: ["FR"], pricing: { monthly: { EUR: 20 } } },
  { id: "free_mobile", names: ["Free Mobile", "Free"], category: "telecom", domain: "free.fr", color: "#CD0000", countries: ["FR"], pricing: { monthly: { EUR: 9.99 } } },

  // ========== NICHE / SPECIALTY ==========
  { id: "1password_teams", names: ["1Password Teams"], category: "security", domain: "1password.com", color: "#1A8CFF", countries: ["ALL"], pricing: { monthly: { USD: 4 } } },
  { id: "typeform", names: ["Typeform", "Typeform Basic", "Typeform Plus"], category: "productivity", domain: "typeform.com", color: "#262627", countries: ["ALL"], pricing: { monthly: { EUR: 25, USD: 25 } } },
  { id: "webflow", names: ["Webflow Basic", "Webflow CMS", "Webflow Business"], category: "developer", domain: "webflow.com", color: "#4353FF", countries: ["ALL"], pricing: { monthly: { USD: 14 } } },
  { id: "squarespace", names: ["Squarespace Personal", "Squarespace Business"], category: "developer", domain: "squarespace.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 16 } } },
  { id: "shopify", names: ["Shopify Basic", "Shopify", "Shopify Advanced"], category: "developer", domain: "shopify.com", color: "#96BF48", countries: ["ALL"], pricing: { monthly: { USD: 29 } } },
  { id: "wix", names: ["Wix Business", "Wix Unlimited"], category: "developer", domain: "wix.com", color: "#FAAD4D", countries: ["ALL"], pricing: { monthly: { EUR: 17, USD: 17 } } },
  { id: "mailchimp", names: ["Mailchimp Essentials", "Mailchimp Standard"], category: "marketing", domain: "mailchimp.com", color: "#FFE01B", countries: ["ALL"], pricing: { monthly: { USD: 13 } } },
  { id: "hubspot", names: ["HubSpot Starter", "HubSpot Marketing"], category: "marketing", domain: "hubspot.com", color: "#FF7A59", countries: ["ALL"], pricing: { monthly: { EUR: 20, USD: 20 } } },
  { id: "zendesk", names: ["Zendesk Support", "Zendesk Suite"], category: "customer_support", domain: "zendesk.com", color: "#03363D", countries: ["ALL"], pricing: { monthly: { EUR: 19, USD: 19 } } },
  { id: "intercom", names: ["Intercom Starter", "Intercom"], category: "customer_support", domain: "intercom.com", color: "#6AFDEF", countries: ["ALL"], pricing: { monthly: { USD: 39 } } },
  { id: "zapier", names: ["Zapier Starter", "Zapier Professional"], category: "automation", domain: "zapier.com", color: "#FF4A00", countries: ["ALL"], pricing: { monthly: { USD: 19.99 } } },
  { id: "make", names: ["Make", "Make Core", "Integromat"], category: "automation", domain: "make.com", color: "#6D00CC", countries: ["ALL"], pricing: { monthly: { EUR: 9, USD: 9 } } },
  { id: "buffer", names: ["Buffer Essentials", "Buffer Team"], category: "marketing", domain: "buffer.com", color: "#168EEA", countries: ["ALL"], pricing: { monthly: { USD: 5 } } },
  { id: "hootsuite", names: ["Hootsuite Professional", "Hootsuite Team"], category: "marketing", domain: "hootsuite.com", color: "#143059", countries: ["ALL"], pricing: { monthly: { USD: 99 } } },
  { id: "semrush", names: ["SEMrush Pro", "Semrush Guru"], category: "marketing", domain: "semrush.com", color: "#FF642D", countries: ["ALL"], pricing: { monthly: { USD: 129.95 } } },
  { id: "ahrefs", names: ["Ahrefs Lite", "Ahrefs Standard"], category: "marketing", domain: "ahrefs.com", color: "#FF7043", countries: ["ALL"], pricing: { monthly: { USD: 99 } } },
  { id: "lottiefiles", names: ["LottieFiles Premium"], category: "design", domain: "lottiefiles.com", color: "#00DDB4", countries: ["ALL"], pricing: { monthly: { USD: 18 } } },
  { id: "envato_elements", names: ["Envato Elements"], category: "design", domain: "elements.envato.com", color: "#81B441", countries: ["ALL"], pricing: { monthly: { USD: 16.50 } } },
  { id: "shutterstock", names: ["Shutterstock", "Shutterstock Standard"], category: "design", domain: "shutterstock.com", color: "#EE2B24", countries: ["ALL"], pricing: { monthly: { USD: 29 } } },
  { id: "getty_images", names: ["Getty Images", "iStock"], category: "design", domain: "gettyimages.com", color: "#CC0000", countries: ["ALL"], pricing: { monthly: { USD: 35 } } },
  { id: "ancestry", names: ["Ancestry", "Ancestry DNA"], category: "lifestyle", domain: "ancestry.com", color: "#128851", countries: ["US", "UK", "DE", "FR"], pricing: { monthly: { EUR: 14.99, GBP: 12.99, USD: 24.99 } } },
  { id: "lastpass_teams", names: ["LastPass Teams"], category: "security", domain: "lastpass.com", color: "#D32D27", countries: ["ALL"], pricing: { monthly: { USD: 4 } } },
  { id: "plex", names: ["Plex Pass", "Plex"], category: "streaming_video", domain: "plex.tv", color: "#E5A00D", countries: ["ALL"], pricing: { monthly: { USD: 4.99 } } },
  { id: "emby", names: ["Emby Premiere", "Emby"], category: "streaming_video", domain: "emby.media", color: "#52B54B", countries: ["ALL"], pricing: { monthly: { USD: 4.99 } } },
  { id: "setapp", names: ["Setapp"], category: "productivity", domain: "setapp.com", color: "#6B4FBB", countries: ["ALL"], pricing: { monthly: { EUR: 9.99, USD: 9.99 } } },
  { id: "bartender", names: ["Bartender 4", "Bartender"], category: "productivity", domain: "macbartender.com", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 4 } } },
  { id: "alfred", names: ["Alfred Powerpack"], category: "productivity", domain: "alfredapp.com", color: "#6B6B6B", countries: ["ALL"], pricing: { monthly: { GBP: 3.33 } } },
  { id: "hazel", names: ["Hazel"], category: "productivity", domain: "noodlesoft.com", color: "#336699", countries: ["ALL"], pricing: { monthly: { USD: 4 } } },
  { id: "fantastical", names: ["Fantastical Premium", "Fantastical"], category: "productivity", domain: "flexibits.com", color: "#E74C3C", countries: ["ALL"], pricing: { monthly: { USD: 4.75 } } },
  { id: "things_cloud", names: ["Things Cloud", "Things 3"], category: "productivity", domain: "culturedcode.com", color: "#3498DB", countries: ["ALL"], pricing: { monthly: { USD: 0 } } },
  { id: "bear", names: ["Bear Pro", "Bear"], category: "productivity", domain: "bear.app", color: "#F7A300", countries: ["ALL"], pricing: { monthly: { USD: 2.99 } } },
  { id: "day_one", names: ["Day One Premium", "Day One"], category: "productivity", domain: "dayoneapp.com", color: "#4A90D9", countries: ["ALL"], pricing: { monthly: { USD: 2.92 } } },
  { id: "luminar_neo", names: ["Luminar Neo", "Luminar AI"], category: "design", domain: "skylum.com", color: "#FF6B35", countries: ["ALL"], pricing: { monthly: { USD: 9.95 } } },
  { id: "lightroom", names: ["Adobe Lightroom", "Lightroom Classic"], category: "design", domain: "adobe.com", color: "#31A8FF", countries: ["ALL"], pricing: { monthly: { EUR: 11.99, USD: 9.99 } } },
  { id: "darkroom", names: ["Darkroom Plus", "Darkroom"], category: "design", domain: "darkroom.app", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 7.99 } } },
  { id: "vsco", names: ["VSCO Membership", "VSCO Pro"], category: "design", domain: "vsco.co", color: "#000000", countries: ["ALL"], pricing: { monthly: { USD: 29.99 } } },
];

// ========== SEARCH FUNCTION ==========
export function searchSubscription(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return SUBSCRIPTION_DATABASE.filter(sub =>
    sub.names.some(name => name.toLowerCase().includes(q)) ||
    sub.category.toLowerCase().includes(q) ||
    sub.domain.toLowerCase().includes(q)
  ).slice(0, 10);
}

// ========== PRICE TRACKING ==========
// Structure for tracking price changes
export const PRICE_HISTORY_SCHEMA = {
  subscription_id: "string",
  previous_price: "number",
  new_price: "number",
  currency: "string",
  changed_at: "timestamp",
  notified: "boolean"
};

export const CATEGORIES = {
  streaming_video: { label: "Streaming", labelES: "Streaming", labelDE: "Streaming", labelFR: "Streaming", labelPL: "Streaming", icon: "tv" },
  streaming_music: { label: "Music", labelES: "Música", labelDE: "Musik", labelFR: "Musique", labelPL: "Muzyka", icon: "music" },
  productivity: { label: "Productivity", labelES: "Productividad", labelDE: "Produktivität", labelFR: "Productivité", labelPL: "Produktywność", icon: "briefcase" },
  design: { label: "Design & Creative", labelES: "Diseño", labelDE: "Design", labelFR: "Design", labelPL: "Design", icon: "pen-tool" },
  ai: { label: "AI Tools", labelES: "Herramientas IA", labelDE: "KI-Tools", labelFR: "Outils IA", labelPL: "Narzędzia AI", icon: "cpu" },
  storage: { label: "Cloud Storage", labelES: "Almacenamiento", labelDE: "Cloud-Speicher", labelFR: "Stockage Cloud", labelPL: "Chmura", icon: "cloud" },
  developer: { label: "Developer", labelES: "Desarrollador", labelDE: "Entwickler", labelFR: "Développeur", labelPL: "Deweloper", icon: "code" },
  communication: { label: "Communication", labelES: "Comunicación", labelDE: "Kommunikation", labelFR: "Communication", labelPL: "Komunikacja", icon: "message-circle" },
  fitness: { label: "Fitness & Health", labelES: "Fitness y Salud", labelDE: "Fitness & Gesundheit", labelFR: "Fitness & Santé", labelPL: "Fitness i Zdrowie", icon: "heart" },
  education: { label: "Education", labelES: "Educación", labelDE: "Bildung", labelFR: "Éducation", labelPL: "Edukacja", icon: "book" },
  gaming: { label: "Gaming", labelES: "Juegos", labelDE: "Gaming", labelFR: "Jeux", labelPL: "Gry", icon: "gamepad" },
  news: { label: "News & Reading", labelES: "Noticias y Lectura", labelDE: "Nachrichten & Lesen", labelFR: "Actualités & Lecture", labelPL: "Wiadomości", icon: "newspaper" },
  finance: { label: "Finance", labelES: "Finanzas", labelDE: "Finanzen", labelFR: "Finance", labelPL: "Finanse", icon: "credit-card" },
  security: { label: "Security & VPN", labelES: "Seguridad y VPN", labelDE: "Sicherheit & VPN", labelFR: "Sécurité & VPN", labelPL: "Bezpieczeństwo i VPN", icon: "shield" },
  shopping: { label: "Shopping", labelES: "Compras", labelDE: "Shopping", labelFR: "Shopping", labelPL: "Zakupy", icon: "shopping-bag" },
  food: { label: "Food & Delivery", labelES: "Comida y Delivery", labelDE: "Essen & Lieferung", labelFR: "Alimentation", labelPL: "Jedzenie i Dostawa", icon: "coffee" },
  telecom: { label: "Telecom", labelES: "Telefonía", labelDE: "Telekommunikation", labelFR: "Télécommunication", labelPL: "Telekomunikacja", icon: "phone" },
  marketing: { label: "Marketing", labelES: "Marketing", labelDE: "Marketing", labelFR: "Marketing", labelPL: "Marketing", icon: "trending-up" },
  automation: { label: "Automation", labelES: "Automatización", labelDE: "Automatisierung", labelFR: "Automatisation", labelPL: "Automatyzacja", icon: "zap" },
  lifestyle: { label: "Lifestyle", labelES: "Estilo de vida", labelDE: "Lifestyle", labelFR: "Style de vie", labelPL: "Styl życia", icon: "star" },
};
