// Gmail scanner: fetch last-90-day messages, filter by sender, extract amounts,
// group recurring senders, and assign confidence scores. Pure client-side.

// ─── TARGET DOMAINS (services we actively look for) ───────────────────────────
export const TARGET_DOMAINS = [
  // Streaming — Global
  "netflix.com", "spotify.com", "disneyplus.com", "disney.com",
  "hbomax.com", "max.com", "hbo.com", "hulu.com", "peacocktv.com",
  "paramountplus.com", "crunchyroll.com", "tidal.com", "deezer.com",
  "twitch.tv", "youtube.com", "primevideo.com",

  // Streaming — Europe / LATAM / Asia
  "rtve.es", "movistar.es", "vodafone.es", "orange.es",
  "sky.com", "nowtv.com", "britbox.com", "channel4.com",
  "canalplus.com", "mycanal.fr", "salto.fr", "artetv.fr",
  "joyn.de", "magentaTV.de", "wow.de",
  "viaplay.com", "nent.se", "svtplay.se",
  "globoplay.globo.com", "clarovideo.com", "startplus.com",
  "hotstar.com", "zee5.com", "sonyliv.com", "jiocinema.com",
  "wavve.com", "seezn.com", "laftel.net",

  // Music
  "apple.com", "icloud.com", "music.apple.com",
  "amazon.com", "music.amazon.com",
  "soundcloud.com", "bandcamp.com", "mixcloud.com",
  "idagio.com", "primephonic.com",

  // Cloud Storage
  "dropbox.com", "box.com", "sync.com",
  "mega.io", "mega.nz", "pcloud.com", "icedrive.net",
  "proton.me", "internxt.com",

  // Productivity & Work
  "notion.so", "evernote.com", "obsidian.md",
  "airtable.com", "clickup.com", "monday.com", "asana.com",
  "trello.com", "basecamp.com", "todoist.com",
  "slack.com", "zoom.us", "webex.com", "teams.microsoft.com",
  "miro.com", "loom.com", "calendly.com", "doodle.com",

  // Microsoft & Google
  "microsoft.com", "office.com", "onedrive.com",
  "google.com", "workspace.google.com", "gsuite.google.com",

  // Design & Creative
  "figma.com", "canva.com", "adobe.com", "sketch.com",
  "invisionapp.com", "zeplin.io", "abstract.com",
  "framer.com", "webflow.com", "squarespace.com", "wix.com",
  "penpot.app", "affinity.serif.com",

  // Software & Dev
  "github.com", "gitlab.com", "bitbucket.org",
  "jetbrains.com", "replit.com", "codepen.io",
  "heroku.com", "digitalocean.com", "netlify.com", "vercel.com",
  "aws.amazon.com", "azure.microsoft.com",
  "linear.app", "jira.atlassian.com", "confluence.atlassian.com",

  // AI & New Tech
  "openai.com", "chatgpt.com", "anthropic.com",
  "midjourney.com", "runway.ml", "elevenlabs.io",
  "jasper.ai", "copy.ai", "writesonic.com",
  "perplexity.ai", "character.ai", "poe.com",

  // VPN & Security
  "nordvpn.com", "expressvpn.com", "surfshark.com",
  "cyberghostvpn.com", "privateinternetaccess.com", "mullvad.net",
  "protonvpn.com", "tunnelbear.com", "windscribe.com",
  "1password.com", "lastpass.com", "dashlane.com", "bitwarden.com",
  "keeper.io", "nordpass.com",

  // Finance & Banking
  "revolut.com", "wise.com", "n26.com", "monzo.com",
  "trading212.com", "etoro.com", "degiro.com", "scalable.capital",
  "coinbase.com", "binance.com", "kraken.com",
  "quickbooks.intuit.com", "xero.com", "freshbooks.com",

  // Health & Fitness
  "headspace.com", "calm.com", "meditopia.com", "insight.com",
  "peloton.com", "onepeloton.com", "whoop.com",
  "myfitnesspal.com", "noom.com", "fitbod.me",
  "strava.com", "garmin.com", "polar.com",
  "hinge.co", "tinder.com", "bumble.com", "match.com",
  "care.com", "betterhelp.com", "talkspace.com",

  // Education
  "duolingo.com", "babbel.com", "rosettastone.com",
  "coursera.org", "udemy.com", "skillshare.com",
  "masterclass.com", "brilliant.org", "khanacademy.org",
  "linkedin.com", "pluralsight.com", "udacity.com",

  // Gaming
  "xbox.com", "playstation.com", "nintendo.com",
  "ea.com", "ubisoft.com", "epicgames.com",
  "steampowered.com", "gog.com", "humble.com",
  "nvidia.com", "shadow.tech",

  // News & Reading
  "nytimes.com", "wsj.com", "economist.com",
  "theguardian.com", "ft.com", "bloomberg.com",
  "medium.com", "substack.com", "readwise.io",
  "scribd.com", "audible.com", "storytel.com",
  "kindle.amazon.com", "kobo.com",

  // Ecommerce & Delivery (subscription tiers)
  "amazon.com", "shopify.com",
  "deliveroo.com", "hellofresh.com", "gousto.co.uk",
  "marleyspoon.com", "sunbasket.com",

  // Telecom — Spain / EU
  "movistar.es", "vodafone.es", "orange.es", "masmovil.es",
  "yoigo.com", "jazztel.com", "lowi.es",
  "telekom.de", "vodafone.de", "o2online.de",
  "sfr.fr", "bouyguestelecom.fr", "free.fr",
  "sky.it", "tim.it", "vodafone.it",

  // Misc popular
  "grammarly.com", "paperpile.com", "zotero.org",
  "descript.com", "otter.ai", "rev.com",
  "zapier.com", "make.com", "airtable.com",
  "hotjar.com", "mixpanel.com", "amplitude.com",
  "intercom.io", "hubspot.com", "mailchimp.com",
  "sendgrid.com", "twilio.com",
];

// ─── EXCLUSIONS — one-time payments, booking, food delivery, marketplaces ─────
export const NON_SUBSCRIPTION_DOMAINS = [
  // Sports booking
  "playtomic.io", "decathlon.es", "sportmaster.ru",

  // Food delivery
  "just-eat.com", "justeat.co.uk", "justeat.es",
  "deliveroo.com", "ubereats.com", "glovo.com",
  "doordash.com", "grubhub.com", "postmates.com",
  "wolt.com", "stuartdelivery.com", "yandex.com",

  // Travel & accommodation
  "booking.com", "airbnb.com", "vrbo.com",
  "hotels.com", "expedia.com", "kayak.com",
  "tripadvisor.com", "hostelworld.com", "trivago.com",
  "ryanair.com", "easyjet.com", "vueling.com",
  "iberia.com", "renfe.es", "sncf.fr", "trenitalia.com",

  // Events & tickets
  "eventbrite.com", "ticketmaster.com", "seetickets.com",
  "stubhub.com", "viagogo.com", "entradas.com",
  "livenation.com",

  // Marketplaces
  "etsy.com", "ebay.com", "aliexpress.com",
  "vinted.es", "wallapop.com", "milanuncios.com",
  "leboncoin.fr", "kleinanzeigen.de",

  // Ride sharing
  "uber.com", "bolt.eu", "cabify.com",
  "blablacar.es", "lyft.com", "freenow.com",

  // Food ordering (not subscriptions)
  "mcdonalds.com", "burgerking.com", "dominospizza.com",
  "pizzahut.com", "kfc.com",

  // One-time purchases
  "apple.com/shop", "store.google.com",
  "mediamarkt.es", "fnac.es", "elcorteingles.es",
  "amazon.com/order", "amzn.com",

  // Banks (transactions, not subscriptions)
  "paypal.com", "stripe.com", "square.com",
  "sumup.com", "izettle.com",
];

// ─── SUBJECT KEYWORDS — one-time (non-subscription) signals ──────────────────
export const NON_SUBSCRIPTION_KEYWORDS = [
  // Booking / reservation
  "booking confirmation", "reservation confirmed", "you booked",
  "your booking", "reservation number", "check-in",

  // Orders
  "order confirmation", "your order", "order #", "order number",
  "your purchase", "purchase confirmation", "receipt for your order",
  "item shipped", "has been shipped", "out for delivery",
  "your delivery", "delivered",

  // Tickets / events
  "ticket confirmation", "your ticket", "your tickets",
  "event confirmation", "e-ticket",

  // One-time payment signals
  "one-time payment", "single payment", "pay per use",
  "session booking", "court booking", "match booking",

  // Ride / food
  "your trip", "ride receipt", "your driver",
  "your food is", "arriving soon",

  // Bank / payment (not subscription)
  "payment received", "transfer complete", "you sent",
  "money sent", "payment sent",
];

// ─── SUBJECT KEYWORDS — strong subscription signals ───────────────────────────
export const SUBSCRIPTION_SUBJECT_KEYWORDS = [
  // Core subscription words
  "subscription", "subscripción", "abonnement", "abonnement",
  "abbonamento", "assinatura", "prenumeration",

  // Renewal
  "renewal", "renewed", "auto-renew", "auto renew",
  "renovación", "renouvellement", "rinnovo",

  // Billing
  "billing", "invoice", "factura", "rechnung", "facture",
  "fattura", "fatura",

  // Payment cycle
  "monthly payment", "annual payment", "yearly payment",
  "pago mensual", "pago anual",
  "your plan", "tu plan", "votre abonnement",

  // Membership
  "membership", "membre", "mitgliedschaft", "membresía",

  // Upcoming / scheduled
  "upcoming charge", "next charge", "next billing",
  "próximo cobro", "prochain prélèvement",
  "will be charged", "will renew",
  "trial ending", "trial ends", "free trial",
];

export interface ParsedEmail {
  id: string;
  senderName: string;
  senderDomain: string;
  amount: number | null;
  currency: string | null;
  date: Date;
  subject: string;
}

export interface DetectedSubscription {
  merchant: string;
  domain: string;
  amount: number;
  currency: string;
  frequency: "monthly" | "yearly" | "quarterly" | "unknown";
  occurrences: number;
  confidence: number;
  lastSeen: Date;
}

const LS_DETECTED = "paythra_detected_subscriptions";
const LS_DISMISSED = "paythra_dismissed_merchants";
const LS_CONFIRMED_DOMAINS = "paythra_confirmed_subs";
const LS_PAYTHRA_SUBS = "paythra_subscriptions";

async function gmailFetch(token: string, path: string): Promise<any> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gmail API ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function fetchEmailsLast90Days(
  accessToken: string,
  onProgress?: (msg: string) => void
): Promise<ParsedEmail[]> {
  const after = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000);

  // Split into batches to avoid query length limits
  const BATCH_SIZE = 20;
  const allMessageIds: string[] = [];

  for (let i = 0; i < TARGET_DOMAINS.length; i += BATCH_SIZE) {
    const chunk = TARGET_DOMAINS.slice(i, i + BATCH_SIZE);
    const fromQuery = chunk.map((d) => `from:${d}`).join(" OR ");
    const q = encodeURIComponent(`(${fromQuery}) after:${after}`);

    let pageToken: string | undefined;
    let pages = 0;
    do {
      try {
        const url = `/messages?q=${q}&maxResults=100${pageToken ? `&pageToken=${pageToken}` : ""}`;
        const data = await gmailFetch(accessToken, url);
        if (data.messages) allMessageIds.push(...data.messages.map((m: any) => m.id));
        pageToken = data.nextPageToken;
        pages++;
        if (pages > 3) break;
      } catch {
        break;
      }
    } while (pageToken);
  }

  // Deduplicate
  const messageIds = [...new Set(allMessageIds)];
  onProgress?.(`Found ${messageIds.length} relevant emails. Analysing…`);

  const parsed: ParsedEmail[] = [];
  const batchSize = 10;
  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((id) =>
        gmailFetch(
          accessToken,
          `/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`
        )
          .then((msg) => parseMessage(id, msg))
          .catch(() => null)
      )
    );
    for (const r of results) if (r) parsed.push(r);
    onProgress?.(`Processed ${Math.min(i + batchSize, messageIds.length)} / ${messageIds.length}…`);
  }

  // Fetch full body for emails without an amount in subject
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i].amount === null) {
      try {
        const full = await gmailFetch(accessToken, `/messages/${parsed[i].id}?format=full`);
        const text = extractBodyText(full);
        const { amount, currency } = extractAmount(text + " " + parsed[i].subject);
        parsed[i].amount = amount;
        parsed[i].currency = currency;
      } catch {
        /* skip */
      }
    }
  }

  return parsed;
}

function parseMessage(id: string, msg: any): ParsedEmail | null {
  const headers: { name: string; value: string }[] = msg.payload?.headers ?? [];
  const get = (n: string) =>
    headers.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value ?? "";
  const from = get("From");
  const subject = get("Subject");
  const dateStr = get("Date");

  const { name, domain } = parseSender(from);
  if (!domain) return null;

  // Check if domain matches any target (including subdomains)
  const matched = TARGET_DOMAINS.find((d) => domain === d || domain.endsWith("." + d));
  if (!matched) return null;

  // Immediately reject known non-subscription domains
  const isExcluded = NON_SUBSCRIPTION_DOMAINS.some(
    (d) => domain === d || domain.endsWith("." + d)
  );
  if (isExcluded) return null;

  const date = dateStr ? new Date(dateStr) : new Date();
  const { amount, currency } = extractAmount(subject);

  return {
    id,
    senderName: name || matched,
    senderDomain: matched,
    amount,
    currency,
    date,
    subject,
  };
}

function parseSender(from: string): { name: string; domain: string } {
  const match = from.match(/(?:"?([^"<]*)"?\s*)?<?([^<>\s]+@[^<>\s]+)>?/);
  if (!match) return { name: "", domain: "" };
  const name = (match[1] || "").trim().replace(/^"|"$/g, "");
  const email = match[2];
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return { name, domain };
}

function extractBodyText(msg: any): string {
  const parts: string[] = [];
  const walk = (p: any) => {
    if (!p) return;
    if (p.body?.data) {
      try {
        const decoded = atob(p.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        parts.push(decoded);
      } catch {
        /* skip */
      }
    }
    if (p.parts) p.parts.forEach(walk);
  };
  walk(msg.payload);
  return parts.join(" ").replace(/<[^>]+>/g, " ");
}

// ─── AMOUNT EXTRACTION — supports €, £, $, CHF, SEK, NOK, DKK, PLN, BRL ─────
const CURRENCY_MAP: Record<string, string> = {
  "£": "GBP", "€": "EUR", "$": "USD",
  "Fr.": "CHF", "CHF": "CHF",
  "kr": "SEK", "SEK": "SEK", "NOK": "NOK", "DKK": "DKK",
  "zł": "PLN", "PLN": "PLN",
  "R$": "BRL", "BRL": "BRL",
  "A$": "AUD", "AUD": "AUD",
  "C$": "CAD", "CAD": "CAD",
  "¥": "JPY", "JPY": "JPY",
  "₹": "INR", "INR": "INR",
};

export function extractAmount(text: string): { amount: number | null; currency: string | null } {
  if (!text) return { amount: null, currency: null };

  const patterns = [
    // Symbol before number: €9.99, £12.99, $9, R$29.90
    /([£€$¥₹]|R\$|A\$|C\$)\s?(\d+(?:[.,]\d{1,2})?)/,
    // Code after number: 9.99 EUR, 12.99 GBP
    /(\d+(?:[.,]\d{1,2})?)\s?(EUR|GBP|USD|CHF|SEK|NOK|DKK|PLN|BRL|AUD|CAD|JPY|INR)/i,
    // CHF before number
    /(CHF|Fr\.)\s?(\d+(?:[.,]\d{1,2})?)/,
    // Nordic kr
    /(\d+(?:[.,]\d{1,2})?)\s?(kr)/i,
    // Polish zł
    /(\d+(?:[.,]\d{1,2})?)\s?(zł)/,
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      // Figure out which group is the number
      const numStr = /^\d/.test(m[1]) ? m[1] : m[2];
      const symStr = /^\d/.test(m[1]) ? m[2] : m[1];
      const amount = parseFloat(numStr.replace(",", "."));
      if (amount > 0 && amount < 10000) {
        const currency = CURRENCY_MAP[symStr.toUpperCase()] ?? CURRENCY_MAP[symStr] ?? "EUR";
        return { amount, currency };
      }
    }
  }
  return { amount: null, currency: null };
}

// ─── GROUP RECURRING ──────────────────────────────────────────────────────────
export function groupRecurring(emails: ParsedEmail[]): DetectedSubscription[] {
  const byDomain = new Map<string, ParsedEmail[]>();

  for (const e of emails) {
    // Skip known non-subscription domains
    if (NON_SUBSCRIPTION_DOMAINS.some((d) => e.senderDomain.includes(d))) continue;

    const subjectLower = e.subject.toLowerCase();

    // Check for one-time payment signals
    const isOneTime = NON_SUBSCRIPTION_KEYWORDS.some((kw) => subjectLower.includes(kw));
    // Check for subscription signals
    const isSubscription = SUBSCRIPTION_SUBJECT_KEYWORDS.some((kw) => subjectLower.includes(kw));

    // Skip if it clearly looks like a one-time charge and NOT a subscription
    if (isOneTime && !isSubscription) continue;

    if (!byDomain.has(e.senderDomain)) byDomain.set(e.senderDomain, []);
    byDomain.get(e.senderDomain)!.push(e);
  }

  const detected: DetectedSubscription[] = [];

  for (const [domain, items] of byDomain) {
    items.sort((a, b) => a.date.getTime() - b.date.getTime());
    const amounts = items.map((i) => i.amount).filter((a): a is number => a !== null);

    // Single email — only include if it has a subscription keyword in subject
    if (items.length < 2) {
      if (amounts.length === 1) {
        const subjectLower = items[0].subject.toLowerCase();
        const hasSubKeyword = SUBSCRIPTION_SUBJECT_KEYWORDS.some((kw) =>
          subjectLower.includes(kw)
        );
        if (hasSubKeyword) {
          detected.push({
            merchant: prettyMerchantName(domain, items[0].senderName),
            domain,
            amount: amounts[0],
            currency: items[0].currency || "EUR",
            frequency: "unknown",
            occurrences: 1,
            confidence: 55,
            lastSeen: items[0].date,
          });
        }
      }
      continue;
    }

    if (amounts.length < 2) continue;

    const cluster = mostCommonCluster(amounts);
    if (!cluster) continue;
    const dominant = cluster.centroid;

    const currency =
      items.find((i) => Math.abs((i.amount ?? 0) - dominant) < 0.01)?.currency ??
      items.find((i) => i.currency)?.currency ??
      "EUR";

    const matchingDates = items
      .filter((i) => i.amount !== null && Math.abs(i.amount - dominant) <= dominant * 0.05)
      .map((i) => i.date.getTime())
      .sort((a, b) => a - b);

    let frequency: DetectedSubscription["frequency"] = "unknown";
    let avgDays = 0;

    if (matchingDates.length >= 2) {
      const gaps: number[] = [];
      for (let i = 1; i < matchingDates.length; i++)
        gaps.push(matchingDates[i] - matchingDates[i - 1]);
      avgDays = gaps.reduce((a, b) => a + b, 0) / gaps.length / (24 * 60 * 60 * 1000);
      if (avgDays >= 20 && avgDays <= 40) frequency = "monthly";
      else if (avgDays >= 80 && avgDays <= 100) frequency = "quarterly";
      else if (avgDays >= 300 && avgDays <= 400) frequency = "yearly";
    }

    // Confidence scoring
    let confidence = 60;
    const amountsAreIdentical =
      cluster.values.every((v) => Math.abs(v - dominant) <= 0.01) &&
      cluster.values.length >= 2;

    if (frequency === "monthly" && amountsAreIdentical) confidence = 98;
    else if (frequency === "monthly") confidence = 85;
    else if (frequency === "yearly" && amountsAreIdentical) confidence = 92;
    else if (frequency === "yearly") confidence = 80;
    else if (frequency === "quarterly") confidence = 78;
    else if (cluster.values.length >= 3) confidence = 75;
    else if (cluster.values.length >= 2) confidence = 65;

    // Boost confidence if subject contains subscription keywords
    const hasSubKeyword = items.some((e) =>
      SUBSCRIPTION_SUBJECT_KEYWORDS.some((kw) => e.subject.toLowerCase().includes(kw))
    );
    if (hasSubKeyword) confidence = Math.min(99, confidence + 5);

    detected.push({
      merchant: prettyMerchantName(domain, items[0].senderName),
      domain,
      amount: dominant,
      currency,
      frequency,
      occurrences: matchingDates.length,
      confidence,
      lastSeen: new Date(
        matchingDates[matchingDates.length - 1] || items[items.length - 1].date
      ),
    });
  }

  return detected.sort((a, b) => b.confidence - a.confidence);
}

function mostCommonCluster(
  amounts: number[]
): { centroid: number; values: number[] } | null {
  const clusters: number[][] = [];
  for (const a of amounts) {
    const c = clusters.find((cl) => Math.abs(cl[0] - a) <= cl[0] * 0.05);
    if (c) c.push(a);
    else clusters.push([a]);
  }
  clusters.sort((a, b) => b.length - a.length);
  const top = clusters[0];
  if (!top || top.length < 2) return null;
  const centroid = Number((top.reduce((s, x) => s + x, 0) / top.length).toFixed(2));
  return { centroid, values: top };
}

// ─── MERCHANT NAME LOOKUP ─────────────────────────────────────────────────────
const MERCHANT_NAMES: Record<string, string> = {
  "netflix.com": "Netflix", "spotify.com": "Spotify",
  "adobe.com": "Adobe Creative Cloud", "amazon.com": "Amazon",
  "apple.com": "Apple", "icloud.com": "iCloud+",
  "dropbox.com": "Dropbox", "google.com": "Google",
  "canva.com": "Canva", "notion.so": "Notion",
  "linkedin.com": "LinkedIn Premium", "chatgpt.com": "ChatGPT Plus",
  "openai.com": "ChatGPT Plus", "anthropic.com": "Claude Pro",
  "microsoft.com": "Microsoft 365", "office.com": "Microsoft 365",
  "slack.com": "Slack", "zoom.us": "Zoom",
  "figma.com": "Figma", "github.com": "GitHub",
  "twitter.com": "X (Twitter)", "disneyplus.com": "Disney+",
  "disney.com": "Disney+", "youtube.com": "YouTube Premium",
  "duolingo.com": "Duolingo", "grammarly.com": "Grammarly",
  "hbo.com": "HBO Max", "max.com": "Max",
  "hulu.com": "Hulu", "headspace.com": "Headspace",
  "nordvpn.com": "NordVPN", "dashlane.com": "Dashlane",
  "squarespace.com": "Squarespace", "wix.com": "Wix",
  "shopify.com": "Shopify", "paramount+.com": "Paramount+",
  "paramountplus.com": "Paramount+", "crunchyroll.com": "Crunchyroll",
  "peacocktv.com": "Peacock", "tidal.com": "Tidal",
  "deezer.com": "Deezer", "twitch.tv": "Twitch",
  "expressvpn.com": "ExpressVPN", "surfshark.com": "Surfshark",
  "1password.com": "1Password", "lastpass.com": "LastPass",
  "evernote.com": "Evernote", "todoist.com": "Todoist",
  "trello.com": "Trello", "asana.com": "Asana",
  "xbox.com": "Xbox Game Pass", "playstation.com": "PlayStation Plus",
  "nintendo.com": "Nintendo Switch Online", "ea.com": "EA Play",
  "calm.com": "Calm", "peloton.com": "Peloton",
  "onepeloton.com": "Peloton", "myfitnesspal.com": "MyFitnessPal",
  "strava.com": "Strava", "audible.com": "Audible",
  "scribd.com": "Scribd", "skillshare.com": "Skillshare",
  "masterclass.com": "MasterClass", "coursera.org": "Coursera",
  "midjourney.com": "Midjourney", "revolut.com": "Revolut",
  "wise.com": "Wise", "monday.com": "Monday.com",
  "clickup.com": "ClickUp", "miro.com": "Miro",
  "loom.com": "Loom", "framer.com": "Framer",
  "webflow.com": "Webflow", "jetbrains.com": "JetBrains",
  "proton.me": "Proton", "protonvpn.com": "Proton VPN",
  "mullvad.net": "Mullvad VPN", "bitwarden.com": "Bitwarden",
  "hubspot.com": "HubSpot", "mailchimp.com": "Mailchimp",
  "zapier.com": "Zapier", "airtable.com": "Airtable",
  "canalplus.com": "Canal+", "sky.com": "Sky",
  "dazn.com": "DAZN", "nytimes.com": "NY Times",
  "wsj.com": "Wall Street Journal", "economist.com": "The Economist",
  "ft.com": "Financial Times", "medium.com": "Medium",
  "substack.com": "Substack", "betterhelp.com": "BetterHelp",
  "tinder.com": "Tinder Gold", "hinge.co": "Hinge+",
  "bumble.com": "Bumble Premium",
};

function prettyMerchantName(domain: string, fallback: string): string {
  return (
    MERCHANT_NAMES[domain] ||
    MERCHANT_NAMES[domain.replace(/^www\./, "")] ||
    fallback ||
    domain
      .replace(/\.(com|net|org|io|so|us|co|tv|me)$/, "")
      .replace(/^www\./, "")
      .split(".")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

// ─── LOCALSTORAGE CACHE ───────────────────────────────────────────────────────
export function saveDetected(items: DetectedSubscription[]) {
  localStorage.setItem(LS_DETECTED, JSON.stringify(items));
}

export function loadDetected(): DetectedSubscription[] {
  const raw = localStorage.getItem(LS_DETECTED);
  if (!raw) return [];
  try {
    return JSON.parse(raw).map((d: any) => ({ ...d, lastSeen: new Date(d.lastSeen) }));
  } catch {
    return [];
  }
}

export function dismissMerchant(domain: string) {
  const list = JSON.parse(localStorage.getItem(LS_DISMISSED) || "[]");
  if (!list.includes(domain)) list.push(domain);
  localStorage.setItem(LS_DISMISSED, JSON.stringify(list));
}

export function getDismissed(): string[] {
  return JSON.parse(localStorage.getItem(LS_DISMISSED) || "[]");
}

export function recordConfirmed(domain: string) {
  const list = JSON.parse(localStorage.getItem(LS_CONFIRMED_DOMAINS) || "[]");
  if (!list.includes(domain)) list.push(domain);
  localStorage.setItem(LS_CONFIRMED_DOMAINS, JSON.stringify(list));
}

export function getConfirmed(): string[] {
  return JSON.parse(localStorage.getItem(LS_CONFIRMED_DOMAINS) || "[]");
}

export function appendPaythraSubscription(sub: DetectedSubscription) {
  const list = JSON.parse(localStorage.getItem(LS_PAYTHRA_SUBS) || "[]");
  list.push({
    merchant: sub.merchant,
    domain: sub.domain,
    amount: sub.amount,
    currency: sub.currency,
    frequency: sub.frequency,
    confidence: sub.confidence,
    addedAt: new Date().toISOString(),
  });
  localStorage.setItem(LS_PAYTHRA_SUBS, JSON.stringify(list));
}
