// Gmail scanner: fetch last-90-day messages, filter by sender, extract amounts,
// group recurring senders. Pure client-side.

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
  lastSeen: Date;
}

const LS_DETECTED = "paythra_detected_subscriptions";
const LS_DISMISSED = "paythra_dismissed_merchants";
const LS_CONFIRMED = "paythra_confirmed_subs";

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

  onProgress?.("Searching emails…");

  const messageIds: string[] = [];
  let pageToken: string | undefined;
  let pages = 0;
  do {
    const url = `/messages?q=${q}&maxResults=100${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const data = await gmailFetch(accessToken, url);
    if (data.messages) messageIds.push(...data.messages.map((m: any) => m.id));
    pageToken = data.nextPageToken;
    pages++;
    if (pages > 5) break; // safety: max ~500 messages
  } while (pageToken);

  onProgress?.(`Found ${messageIds.length} emails. Reading details…`);

  const parsed: ParsedEmail[] = [];
  // Process in batches of 10 in parallel
  const batchSize = 10;
  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((id) =>
        gmailFetch(accessToken, `/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`)
          .then((msg) => parseMessage(id, msg))
          .catch(() => null)
      )
    );
    for (const r of results) if (r) parsed.push(r);
    onProgress?.(`Processed ${Math.min(i + batchSize, messageIds.length)}/${messageIds.length}…`);
  }

  // Need bodies for amount extraction — fetch full for messages without amount
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
  const get = (n: string) => headers.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value ?? "";
  const from = get("From");
  const subject = get("Subject");
  const dateStr = get("Date");

  const { name, domain } = parseSender(from);
  if (!domain) return null;
  // Confirm domain matches one of our targets
  const matched = TARGET_DOMAINS.find((d) => domain.endsWith(d));
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
  // "Netflix <info@netflix.com>" or "info@spotify.com"
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
  // strip html tags crudely
  return parts.join(" ").replace(/<[^>]+>/g, " ");
}

const CURRENCY_MAP: Record<string, string> = {
  "£": "GBP",
  "€": "EUR",
  "$": "USD",
};

export function extractAmount(text: string): { amount: number | null; currency: string | null } {
  if (!text) return { amount: null, currency: null };
  // Match £12.99, € 9.99, $5, 12.99 GBP
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
    if (items.length < 2) continue; // must appear >1 time
    items.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Find dominant amount (similar prices)
    const amounts = items.map((i) => i.amount).filter((a): a is number => a !== null);
    if (amounts.length < 2) continue;

    const dominant = mostCommonAmount(amounts);
    if (dominant === null) continue;

    const currency =
      items.find((i) => i.amount === dominant)?.currency ??
      items.find((i) => i.currency)?.currency ??
      "EUR";

    // Frequency: average gap between sightings of dominant amount
    const matchingDates = items
      .filter((i) => i.amount !== null && Math.abs(i.amount - dominant) <= dominant * 0.05)
      .map((i) => i.date.getTime())
      .sort((a, b) => a - b);

    let frequency: DetectedSubscription["frequency"] = "unknown";
    if (matchingDates.length >= 2) {
      const gaps: number[] = [];
      for (let i = 1; i < matchingDates.length; i++) gaps.push(matchingDates[i] - matchingDates[i - 1]);
      const avgDays = gaps.reduce((a, b) => a + b, 0) / gaps.length / (24 * 60 * 60 * 1000);
      if (avgDays >= 20 && avgDays <= 40) frequency = "monthly";
      else if (avgDays >= 300 && avgDays <= 400) frequency = "yearly";
    }

    detected.push({
      merchant: prettyMerchantName(domain, items[0].senderName),
      domain,
      amount: dominant,
      currency,
      frequency,
      occurrences: matchingDates.length,
      lastSeen: new Date(matchingDates[matchingDates.length - 1] || items[items.length - 1].date),
    });
  }

  return detected.sort((a, b) => b.occurrences - a.occurrences);
}

function mostCommonAmount(amounts: number[]): number | null {
  // Cluster by 5% tolerance, return centroid of largest cluster (≥2 members)
  const clusters: number[][] = [];
  for (const a of amounts) {
    const c = clusters.find((cl) => Math.abs(cl[0] - a) <= cl[0] * 0.05);
    if (c) c.push(a);
    else clusters.push([a]);
  }
  clusters.sort((a, b) => b.length - a.length);
  const top = clusters[0];
  if (!top || top.length < 2) return null;
  return Number((top.reduce((s, x) => s + x, 0) / top.length).toFixed(2));
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
  const list = JSON.parse(localStorage.getItem(LS_CONFIRMED) || "[]");
  if (!list.includes(domain)) list.push(domain);
  localStorage.setItem(LS_CONFIRMED, JSON.stringify(list));
}

export function getConfirmed(): string[] {
  return JSON.parse(localStorage.getItem(LS_CONFIRMED) || "[]");
}
