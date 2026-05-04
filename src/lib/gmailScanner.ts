// Gmail scanner: fetch last-90-day messages, filter by sender, extract amounts,
// group recurring senders, and assign confidence scores. Pure client-side.

export const TARGET_DOMAINS = [
  "netflix.com",
  "spotify.com",
  "adobe.com",
  "amazon.com",
  "apple.com",
  "dropbox.com",
  "google.com",
  "canva.com",
  "notion.so",
  "linkedin.com",
  "chatgpt.com",
  "openai.com",
  "paypal.com",
  "microsoft.com",
  "slack.com",
  "zoom.us",
  "figma.com",
  "github.com",
  "twitter.com",
  "icloud.com",
  "disneyplus.com",
  "disney.com",
  "youtube.com",
  "duolingo.com",
  "grammarly.com",
  "hbo.com",
  "max.com",
  "hulu.com",
  "headspace.com",
  "nordvpn.com",
  "dashlane.com",
  "squarespace.com",
  "wix.com",
  "shopify.com",
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
  frequency: "monthly" | "yearly" | "unknown";
  occurrences: number;
  confidence: number; // 0-100
  lastSeen: Date;
}

const LS_DETECTED = "paythra_detected_subscriptions";
const LS_DISMISSED = "paythra_dismissed_merchants";
const LS_CONFIRMED_DOMAINS = "paythra_confirmed_subs";
const LS_PAYTHRA_SUBS = "paythra_subscriptions"; // user-spec'd key

// --- Gmail API ---
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
  const fromQuery = TARGET_DOMAINS.map((d) => `from:${d}`).join(" OR ");
  const q = encodeURIComponent(`(${fromQuery}) after:${after}`);

  onProgress?.("Scanning your emails for subscriptions...");

  const messageIds: string[] = [];
  let pageToken: string | undefined;
  let pages = 0;
  do {
    const url = `/messages?q=${q}&maxResults=100${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const data = await gmailFetch(accessToken, url);
    if (data.messages) messageIds.push(...data.messages.map((m: any) => m.id));
    pageToken = data.nextPageToken;
    pages++;
    if (pages > 5) break; // safety cap ~500 messages
  } while (pageToken);

  onProgress?.(`Found ${messageIds.length} emails. Reading details…`);

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
    onProgress?.(`Processed ${Math.min(i + batchSize, messageIds.length)}/${messageIds.length}…`);
  }

  // For messages without an amount, fetch full body
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
  const matched = TARGET_DOMAINS.find((d) => domain === d || domain.endsWith("." + d));
  if (!matched) return null;

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

const CURRENCY_MAP: Record<string, string> = {
  "£": "GBP",
  "€": "EUR",
  "$": "USD",
};

export function extractAmount(text: string): { amount: number | null; currency: string | null } {
  if (!text) return { amount: null, currency: null };
  const symbolRe = /([£€$])\s?(\d+(?:[.,]\d{1,2})?)/;
  const codeRe = /(\d+(?:[.,]\d{1,2})?)\s?(GBP|EUR|USD)/i;
  let m = text.match(symbolRe);
  if (m) {
    const amount = parseFloat(m[2].replace(",", "."));
    if (amount > 0 && amount < 10000) return { amount, currency: CURRENCY_MAP[m[1]] };
  }
  m = text.match(codeRe);
  if (m) {
    const amount = parseFloat(m[1].replace(",", "."));
    if (amount > 0 && amount < 10000) return { amount, currency: m[2].toUpperCase() };
  }
  return { amount: null, currency: null };
}

export function groupRecurring(emails: ParsedEmail[]): DetectedSubscription[] {
  const byDomain = new Map<string, ParsedEmail[]>();
  for (const e of emails) {
    if (!byDomain.has(e.senderDomain)) byDomain.set(e.senderDomain, []);
    byDomain.get(e.senderDomain)!.push(e);
  }

  const detected: DetectedSubscription[] = [];
  for (const [domain, items] of byDomain) {
    items.sort((a, b) => a.date.getTime() - b.date.getTime());
    const amounts = items.map((i) => i.amount).filter((a): a is number => a !== null);

    // Single email seen → low-confidence entry if we have an amount
    if (items.length < 2) {
      if (amounts.length === 1) {
        detected.push({
          merchant: prettyMerchantName(domain, items[0].senderName),
          domain,
          amount: amounts[0],
          currency: items[0].currency || "EUR",
          frequency: "unknown",
          occurrences: 1,
          confidence: 45,
          lastSeen: items[0].date,
        });
      }
      continue;
    }

    if (amounts.length < 2) continue;

    const cluster = mostCommonCluster(amounts);
    if (!cluster) continue;
    const dominant = cluster.centroid;

    const currency =
      items.find((i) => i.amount === dominant)?.currency ??
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
      else if (avgDays >= 300 && avgDays <= 400) frequency = "yearly";
    }

    // Confidence:
    //  - same amount repeats monthly → 98%
    //  - similar amounts (cluster found, but not clean monthly) → 72%
    let confidence = 72;
    const amountsAreIdentical =
      cluster.values.every((v) => Math.abs(v - dominant) <= 0.01) && cluster.values.length >= 2;
    if (frequency === "monthly" && amountsAreIdentical) confidence = 98;
    else if (frequency === "yearly" && amountsAreIdentical) confidence = 92;

    detected.push({
      merchant: prettyMerchantName(domain, items[0].senderName),
      domain,
      amount: dominant,
      currency,
      frequency,
      occurrences: matchingDates.length,
      confidence,
      lastSeen: new Date(matchingDates[matchingDates.length - 1] || items[items.length - 1].date),
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

function prettyMerchantName(domain: string, fallback: string): string {
  const map: Record<string, string> = {
    "netflix.com": "Netflix",
    "spotify.com": "Spotify",
    "adobe.com": "Adobe",
    "amazon.com": "Amazon",
    "apple.com": "Apple",
    "dropbox.com": "Dropbox",
    "google.com": "Google",
    "canva.com": "Canva",
    "notion.so": "Notion",
    "linkedin.com": "LinkedIn",
    "chatgpt.com": "ChatGPT",
    "paypal.com": "PayPal",
    "microsoft.com": "Microsoft",
    "slack.com": "Slack",
    "zoom.us": "Zoom",
    "figma.com": "Figma",
    "github.com": "GitHub",
    "twitter.com": "Twitter / X",
    "icloud.com": "iCloud",
  };
  return map[domain] || fallback || domain;
}

// --- localStorage cache ---
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

/** Append a confirmed subscription to paythra_subscriptions in localStorage. */
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
