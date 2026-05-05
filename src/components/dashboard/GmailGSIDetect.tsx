import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  Search,
  Unplug,
  CheckCircle2,
  Loader2,
  Plus,
  X,
  Sparkles,
  Clock,
  HelpCircle,
  Ban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import {
  getDatabaseEntryByName,
  getDatabasePriceEUR,
  SUBSCRIPTION_DATABASE,
} from "@/data/subscriptionDatabase";

const CLIENT_ID =
  "640863753608-e2g9mvhohjvh6p6q9nee5tpv5vq1bce5.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

const TOKENS_KEY = "gmail_tokens";
const LAST_SCANNED_KEY = "gmail_last_scanned";
const DETECTED_SERVICES_KEY = "gmail_detected_services";

// Domain → display name mapping (extended sender list)
const KNOWN_SERVICES: Record<string, string> = {
  "netflix.com": "Netflix",
  "spotify.com": "Spotify",
  "adobe.com": "Adobe",
  "apple.com": "Apple",
  "amazon.com": "Amazon",
  "openai.com": "OpenAI",
  "notion.so": "Notion",
  "dropbox.com": "Dropbox",
  "microsoft.com": "Microsoft",
  "google.com": "Google",
  "disney.com": "Disney+",
  "linkedin.com": "LinkedIn",
  "canva.com": "Canva",
  "grammarly.com": "Grammarly",
  "duolingo.com": "Duolingo",
  "github.com": "GitHub",
  "figma.com": "Figma",
  "slack.com": "Slack",
  "zoom.us": "Zoom",
  "discord.com": "Discord",
  "nordvpn.com": "NordVPN",
  "expressvpn.com": "ExpressVPN",
  "dashlane.com": "Dashlane",
  "1password.com": "1Password",
  "lastpass.com": "LastPass",
  "headspace.com": "Headspace",
  "calm.com": "Calm",
  "strava.com": "Strava",
  "myfitnesspal.com": "MyFitnessPal",
  "peloton.com": "Peloton",
  "skillshare.com": "Skillshare",
  "masterclass.com": "MasterClass",
  "coursera.org": "Coursera",
  "udemy.com": "Udemy",
  "medium.com": "Medium",
  "substack.com": "Substack",
  "audible.com": "Audible",
  "kindle.com": "Kindle",
  "hulu.com": "Hulu",
  "hbomax.com": "HBO Max",
  "paramountplus.com": "Paramount+",
  "crunchyroll.com": "Crunchyroll",
  "twitch.tv": "Twitch",
  "xbox.com": "Xbox",
  "playstation.com": "PlayStation",
  "nintendo.com": "Nintendo",
  "ea.com": "EA",
  "ubisoft.com": "Ubisoft",
  "shopify.com": "Shopify",
  "squarespace.com": "Squarespace",
  "wix.com": "Wix",
  "webflow.io": "Webflow",
  "mailchimp.com": "Mailchimp",
  "hubspot.com": "HubSpot",
  "zapier.com": "Zapier",
  "airtable.com": "Airtable",
  "monday.com": "Monday",
  "asana.com": "Asana",
  "clickup.com": "ClickUp",
  "trello.com": "Trello",
  "intercom.com": "Intercom",
  "zendesk.com": "Zendesk",
  "revolut.com": "Revolut",
  "n26.com": "N26",
  "wise.com": "Wise",
  "allegro.pl": "Allegro",
  "basic-fit.com": "Basic-Fit",
  "freeletics.com": "Freeletics",
};

const QUERY = [
  "subject:receipt OR subject:invoice OR subject:subscription OR subject:renewal",
  ...Object.keys(KNOWN_SERVICES).map((d) => `from:${d}`),
].join(" OR ");

const IGNORED_DOMAINS_KEY = "gmail_ignored_domains";

const FREE_TIER_DOMAINS = new Set([
  "duolingo.com",
  "twitter.com",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "reddit.com",
  "youtube.com",
  "twitch.tv",
  "pinterest.com",
  "snapchat.com",
]);

const PAYMENT_SUBJECT_KEYWORDS = [
  "receipt", "invoice", "payment confirmation", "order confirmation", "billing",
  "charge", "renewal", "subscription confirmed", "thank you for your purchase",
  "your plan", "payment received", "amount due", "statement",
  "factura", "rechnung", "facture", "reçu", "płatność",
];

const PAYMENT_FROM_PREFIXES = [
  "billing@", "invoice@", "receipt@", "noreply@", "payments@",
  "no-reply@", "accounts@", "subscription@",
];

const PROMO_SUBJECT_KEYWORDS = [
  "offer", "discount", "sale", " off", "deal", "try", "free", "upgrade",
  "limited time", "exclusive", "unlock", "streak", "reminder to practice",
  "miss you", "come back", "we miss you", "special offer",
  "promoción", "angebot", "promotion",
];

const PROMO_FROM_PREFIXES = [
  "marketing@", "promo@", "newsletter@", "hello@", "team@", "hi@",
];

const PROMO_SUBDOMAINS = [
  "marketing.", "news.", "newsletter.", "promo.", "offers.", "deals.", "updates.",
];

const CURRENCY_AMOUNT_RE = /(€|\$|£|PLN)\s?\d+|\d+\s?(€|\$|£|PLN)/i;

interface EmailScore {
  score: number;
  signals: string[];
}

const scoreEmail = (subject: string, fromRaw: string): EmailScore => {
  const signals: string[] = [];
  let score = 0;
  const subj = subject.toLowerCase();
  const from = fromRaw.toLowerCase();
  const fromAddrMatch = fromRaw.match(/<([^>]+)>/);
  const fromAddr = (fromAddrMatch ? fromAddrMatch[1] : fromRaw).toLowerCase().trim();
  const fromDomain = fromAddr.includes("@") ? fromAddr.split("@")[1] : "";

  // Payment signals
  const matchedSubj = PAYMENT_SUBJECT_KEYWORDS.find((k) => subj.includes(k));
  if (matchedSubj) {
    score++;
    signals.push(`subject contains "${matchedSubj.trim()}"`);
  }
  if (CURRENCY_AMOUNT_RE.test(subject)) {
    score++;
    const m = subject.match(CURRENCY_AMOUNT_RE);
    signals.push(`amount ${m?.[0]} in subject`);
  }
  const matchedFrom = PAYMENT_FROM_PREFIXES.find((p) => fromAddr.startsWith(p));
  if (matchedFrom) {
    score++;
    signals.push(`${matchedFrom} sender`);
  }
  const isPromoSubdomain = PROMO_SUBDOMAINS.some((s) => fromDomain.startsWith(s));
  if (!isPromoSubdomain) {
    score++;
    signals.push("not a promo subdomain");
  }

  // Promotional negatives
  const matchedPromo = PROMO_SUBJECT_KEYWORDS.find((k) => subj.includes(k));
  if (matchedPromo) {
    score--;
    signals.push(`promo word "${matchedPromo.trim()}"`);
  }
  if (subject.includes("!")) {
    score--;
    signals.push("exclamation in subject");
  }
  const matchedPromoFrom = PROMO_FROM_PREFIXES.find((p) => fromAddr.startsWith(p));
  if (matchedPromoFrom) {
    score--;
    signals.push(`${matchedPromoFrom} sender`);
  }

  return { score, signals };
};

interface StoredToken {
  email: string;
  access_token: string;
  connected_at: number;
  last_scanned?: number;
  found?: number;
}

interface Detected {
  domain: string;
  name: string;
  count: number;          // total emails seen
  qualifyingCount: number; // emails with score >= 1
  maxScore: number;
  accounts: string[];
  signals: string[];      // unique signals across emails
  hasCurrency: boolean;
  hasBillingSender: boolean;
  hasPaymentSubject: boolean;
  topAmount?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

const loadGsi = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("GSI load failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("GSI load failed"));
    document.head.appendChild(s);
  });

const extractDomain = (from: string): string | null => {
  const m = from.match(/<([^>]+)>/);
  const email = (m ? m[1] : from).trim();
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const domain = email.slice(at + 1).toLowerCase().replace(/>$/, "");
  for (const known of Object.keys(KNOWN_SERVICES)) {
    if (domain === known || domain.endsWith("." + known)) return known;
  }
  return domain;
};

const readTokens = (): StoredToken[] => {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const writeTokens = (t: StoredToken[]) =>
  localStorage.setItem(TOKENS_KEY, JSON.stringify(t));

const readIgnored = (): string[] => {
  try {
    const raw = localStorage.getItem(IGNORED_DOMAINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeIgnored = (arr: string[]) =>
  localStorage.setItem(IGNORED_DOMAINS_KEY, JSON.stringify(arr));

const initialsFor = (email: string) =>
  email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("") || email[0]?.toUpperCase() || "?";

const colorFor = (email: string) => {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) % 360;
  return `hsl(${h}, 65%, 45%)`;
};

const fetchUserEmail = async (token: string): Promise<string> => {
  const r = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`userinfo ${r.status}`);
  const j = await r.json();
  return j.email as string;
};

const scanOneAccount = async (
  token: StoredToken
): Promise<{ groups: Map<string, Detected>; emailsScanned: number; expired?: boolean }> => {
  const groups = new Map<string, Detected>();
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=${encodeURIComponent(
    QUERY
  )}`;
  const listRes = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (listRes.status === 401) return { groups, emailsScanned: 0, expired: true };
  if (!listRes.ok) throw new Error(`Gmail API ${listRes.status}`);
  const list = await listRes.json();
  const ids: string[] = (list.messages || []).map((m: any) => m.id);

  for (const id of ids) {
    const r = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
      { headers: { Authorization: `Bearer ${token.access_token}` } }
    );
    if (r.status === 401) return { groups, emailsScanned: 0, expired: true };
    if (!r.ok) continue;
    const msg = await r.json();
    const headers: Array<{ name: string; value: string }> = msg.payload?.headers || [];
    const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
    const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "";
    const domain = extractDomain(from);
    if (!domain) continue;
    const name =
      KNOWN_SERVICES[domain] ||
      domain.split(".")[0].replace(/^\w/, (c) => c.toUpperCase());

    const { score, signals } = scoreEmail(subject, from);
    const fromAddr = (from.match(/<([^>]+)>/)?.[1] || from).toLowerCase();
    const hasBilling = PAYMENT_FROM_PREFIXES.some((p) => fromAddr.startsWith(p));
    const hasPaySubj = PAYMENT_SUBJECT_KEYWORDS.some((k) => subject.toLowerCase().includes(k));
    const amountMatch = subject.match(CURRENCY_AMOUNT_RE)?.[0];

    const existing = groups.get(domain);
    if (existing) {
      existing.count++;
      if (score >= 1) existing.qualifyingCount++;
      existing.maxScore = Math.max(existing.maxScore, score);
      if (!existing.accounts.includes(token.email)) existing.accounts.push(token.email);
      signals.forEach((s) => {
        if (!existing.signals.includes(s)) existing.signals.push(s);
      });
      existing.hasBillingSender = existing.hasBillingSender || hasBilling;
      existing.hasPaymentSubject = existing.hasPaymentSubject || hasPaySubj;
      existing.hasCurrency = existing.hasCurrency || !!amountMatch;
      if (amountMatch && !existing.topAmount) existing.topAmount = amountMatch;
    } else {
      groups.set(domain, {
        domain,
        name,
        count: 1,
        qualifyingCount: score >= 1 ? 1 : 0,
        maxScore: score,
        accounts: [token.email],
        signals: [...signals],
        hasBillingSender: hasBilling,
        hasPaymentSubject: hasPaySubj,
        hasCurrency: !!amountMatch,
        topAmount: amountMatch,
      });
    }
  }
  return { groups, emailsScanned: ids.length };
};

const GmailGSIDetect = () => {
  const { addSubscription, subscriptions } = useSubscriptions();
  const [accounts, setAccounts] = useState<StoredToken[]>(() => readTokens());
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState("");
  const [detected, setDetected] = useState<Detected[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [ignored, setIgnored] = useState<Set<string>>(() => new Set(readIgnored()));
  const [filter, setFilter] = useState<"all" | "confirmed" | "review">("confirmed");
  const [newServices, setNewServices] = useState<Detected[]>([]);
  const [summary, setSummary] = useState<{
    emails: number;
    services: number;
    newCount: number;
    at: number;
  } | null>(null);
  const [lastScanned, setLastScanned] = useState<number | null>(() => {
    const v = localStorage.getItem(LAST_SCANNED_KEY);
    return v ? Number(v) : null;
  });

  const trackedDomains = useMemo(() => {
    const set = new Set<string>();
    subscriptions.forEach((s) => {
      const entry = getDatabaseEntryByName(s.name);
      if (entry) set.add(entry.domain);
      set.add(s.name.toLowerCase());
    });
    return set;
  }, [subscriptions]);

  useEffect(() => {
    loadGsi().catch(() => {
      toast({ title: "Failed to load Google library", variant: "destructive" });
    });
  }, []);

  const persistAccounts = useCallback((next: StoredToken[]) => {
    writeTokens(next);
    setAccounts(next);
  }, []);

  const disconnectAccount = (email: string) => {
    const next = accounts.filter((a) => a.email !== email);
    persistAccounts(next);
    toast({ title: `${email} disconnected` });
  };

  const runScan = useCallback(
    async (silent = false) => {
      const current = readTokens();
      if (current.length === 0) return;
      if (!silent) {
        setScanning(true);
        setProgress("Scanning all connected Gmail accounts...");
      }
      try {
        const merged = new Map<string, Detected>();
        let totalEmails = 0;
        const updatedAccounts: StoredToken[] = [];
        let anyExpired = false;

        for (const acc of current) {
          if (!silent) setProgress(`Scanning ${acc.email}...`);
          try {
            const { groups, emailsScanned, expired } = await scanOneAccount(acc);
            if (expired) {
              anyExpired = true;
              continue; // drop this token below
            }
            totalEmails += emailsScanned;
            for (const [domain, d] of groups) {
              const existing = merged.get(domain);
              if (existing) {
                existing.count += d.count;
                existing.qualifyingCount += d.qualifyingCount;
                existing.maxScore = Math.max(existing.maxScore, d.maxScore);
                d.accounts.forEach((e) => {
                  if (!existing.accounts.includes(e)) existing.accounts.push(e);
                });
                d.signals.forEach((s) => {
                  if (!existing.signals.includes(s)) existing.signals.push(s);
                });
                existing.hasBillingSender = existing.hasBillingSender || d.hasBillingSender;
                existing.hasPaymentSubject = existing.hasPaymentSubject || d.hasPaymentSubject;
                existing.hasCurrency = existing.hasCurrency || d.hasCurrency;
                if (d.topAmount && !existing.topAmount) existing.topAmount = d.topAmount;
              } else {
                merged.set(domain, { ...d });
              }
            }
            updatedAccounts.push({
              ...acc,
              last_scanned: Date.now(),
              found: groups.size,
            });
          } catch {
            updatedAccounts.push(acc);
          }
        }

        // Drop expired accounts
        const finalAccounts = updatedAccounts.filter((a) =>
          current.some((c) => c.email === a.email)
        );
        if (anyExpired) {
          toast({
            title: "Some Gmail sessions expired",
            description: "Please reconnect those accounts",
            variant: "destructive",
          });
        }
        persistAccounts(finalAccounts);

        const list = Array.from(merged.values()).sort((a, b) => b.count - a.count);

        // Compare against previous
        const prevRaw = localStorage.getItem(DETECTED_SERVICES_KEY);
        const prev: string[] = prevRaw ? JSON.parse(prevRaw) : [];
        const fresh = list.filter((d) => !prev.includes(d.domain));
        localStorage.setItem(
          DETECTED_SERVICES_KEY,
          JSON.stringify(list.map((d) => d.domain))
        );

        const now = Date.now();
        localStorage.setItem(LAST_SCANNED_KEY, String(now));
        setLastScanned(now);
        setDetected(list);
        setNewServices(fresh);
        setSummary({
          emails: totalEmails,
          services: list.length,
          newCount: fresh.length,
          at: now,
        });
        if (!silent) {
          toast({
            title: "Scan complete",
            description: `${list.length} services · ${fresh.length} new`,
          });
        }
      } catch (e: any) {
        if (!silent) toast({ title: "Scan failed", description: e.message, variant: "destructive" });
      } finally {
        setScanning(false);
        setProgress("");
      }
    },
    [persistAccounts]
  );

  // Auto weekly scan
  useEffect(() => {
    if (accounts.length === 0) return;
    const last = Number(localStorage.getItem(LAST_SCANNED_KEY) || 0);
    const week = 7 * 24 * 60 * 60 * 1000;
    if (!last || Date.now() - last > week) {
      const t = setTimeout(() => runScan(true), 1500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    try {
      await loadGsi();
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: async (resp: any) => {
          if (resp.error || !resp.access_token) {
            toast({
              title: "Authorization failed",
              description: resp.error || "No token returned",
              variant: "destructive",
            });
            return;
          }
          try {
            const email = await fetchUserEmail(resp.access_token);
            const current = readTokens();
            const idx = current.findIndex((a) => a.email === email);
            const entry: StoredToken = {
              email,
              access_token: resp.access_token,
              connected_at: Date.now(),
            };
            if (idx >= 0) current[idx] = { ...current[idx], ...entry };
            else current.push(entry);
            persistAccounts(current);
            toast({ title: `${email} connected` });
            runScan(false);
          } catch (e: any) {
            toast({
              title: "Could not read account",
              description: e.message,
              variant: "destructive",
            });
          }
        },
      });
      tokenClient.requestAccessToken();
    } catch (e: any) {
      toast({ title: "Failed to start auth", description: e.message, variant: "destructive" });
    }
  };

  const handleAdd = async (d: Detected) => {
    try {
      // Try to find by domain in database
      const entry =
        SUBSCRIPTION_DATABASE.find((e) => e.domain === d.domain) ||
        getDatabaseEntryByName(d.name);
      const price = entry ? getDatabasePriceEUR(entry, "monthly") || 0 : 0;
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      await addSubscription({
        name: entry?.names[0] || d.name,
        price,
        billing_cycle: "monthly",
        category: entry?.category || "other",
        next_billing_date: next.toISOString().split("T")[0],
        status: "active",
      });
      setAdded((s) => new Set(s).add(d.domain));
      toast({ title: `${entry?.names[0] || d.name} added to Paythra` });
    } catch (e: any) {
      toast({ title: "Failed to add", description: e.message, variant: "destructive" });
    }
  };

  const visible = detected.filter(
    (d) => !dismissed.has(d.domain) && !added.has(d.domain)
  );

  const daysSince = lastScanned
    ? Math.floor((Date.now() - lastScanned) / (24 * 60 * 60 * 1000))
    : null;

  const confidence = (count: number) => {
    if (count >= 3)
      return { label: "Confirmed", className: "bg-green-500 text-white hover:bg-green-500" };
    if (count === 2)
      return { label: "Likely", className: "bg-amber-500 text-white hover:bg-amber-500" };
    return { label: "Check", className: "bg-muted text-muted-foreground hover:bg-muted" };
  };

  const isTracked = (d: Detected) => {
    if (trackedDomains.has(d.domain)) return true;
    if (trackedDomains.has(d.name.toLowerCase())) return true;
    return false;
  };

  // ---------- Empty state ----------
  if (accounts.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <div className="rounded-2xl bg-primary/10 p-4">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="font-display text-lg font-semibold">
              Connect your Gmail to automatically detect subscriptions
            </h3>
            <p className="text-sm text-muted-foreground">
              We scan your receipts and invoices, never your personal emails.
            </p>
          </div>
          <Button onClick={connect} className="gap-2 bg-gradient-primary hover:opacity-90">
            <Mail className="h-4 w-4" /> Connect Gmail
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Last scanned banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {lastScanned
            ? daysSince === 0
              ? "Last scanned: today"
              : `Last scanned: ${daysSince} day${daysSince === 1 ? "" : "s"} ago`
            : "Not scanned yet"}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => runScan(false)}
          disabled={scanning}
          className="gap-2"
        >
          {scanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          {scanning ? "Scanning..." : "Scan now"}
        </Button>
      </div>

      {/* New subscription alerts */}
      <AnimatePresence>
        {newServices.map((n) => (
          <motion.div
            key={n.domain}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4"
          >
            <Sparkles className="h-5 w-5 text-primary shrink-0" />
            <img
              src={`https://logo.clearbit.com/${n.domain}`}
              alt=""
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              className="h-7 w-7 rounded-md object-contain bg-background p-1"
            />
            <p className="text-sm flex-1">
              <span className="font-semibold">New subscription detected: {n.name}</span>
              <span className="text-muted-foreground"> — review below</span>
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setNewServices((arr) => arr.filter((x) => x.domain !== n.domain))}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Connected accounts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Connected Gmail accounts ({accounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {accounts.map((a) => (
              <div
                key={a.email}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: colorFor(a.email) }}
                >
                  {initialsFor(a.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{a.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.last_scanned
                      ? `Scanned ${new Date(a.last_scanned).toLocaleDateString()} · ${a.found ?? 0} found`
                      : "Not scanned yet"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => disconnectAccount(a.email)}
                  className="text-destructive hover:text-destructive"
                >
                  <Unplug className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={connect} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Connect another account
          </Button>
          {scanning && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{progress}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan summary */}
      {summary && (
        <Card className="shadow-card border-primary/30">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="flex-1 text-sm">
              <span className="font-semibold">{summary.emails}</span> emails scanned ·{" "}
              <span className="font-semibold">{summary.services}</span> services ·{" "}
              <span className="font-semibold">{summary.newCount}</span> new
              <span className="text-muted-foreground">
                {" "}
                · {new Date(summary.at).toLocaleTimeString()}
              </span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setSummary(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Detected list */}
      {visible.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Search className="h-5 w-5 text-primary" />
              Detected subscriptions ({visible.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <div className="grid gap-3 sm:grid-cols-2">
                {visible.map((sub) => {
                  const conf = confidence(sub.count);
                  const tracked = isTracked(sub);
                  return (
                    <motion.div
                      key={sub.domain}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-xl border border-border p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={`https://logo.clearbit.com/${sub.domain}`}
                          alt={sub.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                          className="h-9 w-9 rounded-lg object-contain bg-muted p-1 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold truncate">{sub.name}</p>
                            <Badge className={conf.className + " text-[10px]"}>
                              {conf.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {sub.count} email{sub.count === 1 ? "" : "s"} · {sub.domain}
                          </p>
                          {sub.accounts.length > 1 && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              from {sub.accounts.length} accounts
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {tracked ? (
                          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" /> Already tracking
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAdd(sub)}
                            className="flex-1 gap-1 bg-gradient-primary hover:opacity-90"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add to Paythra
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDismissed((s) => new Set(s).add(sub.domain))}
                          className="gap-1"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GmailGSIDetect;
