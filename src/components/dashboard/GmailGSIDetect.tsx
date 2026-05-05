import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Search, Unplug, CheckCircle2, Loader2, Plus, X, ChevronDown, ChevronUp, ShieldCheck, HelpCircle, MinusCircle, Sparkles, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useServicePricing } from "@/hooks/useServicePricing";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getActiveCurrencyCode, convertFromEUR, CURRENCIES, convertToEUR } from "@/lib/currency";

const CLIENT_ID =
  "640863753608-e2g9mvhohjvh6p6q9nee5tpv5vq1bce5.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const ACCOUNTS_KEY = "gmail_accounts";
const LEGACY_TOKEN_KEY = "gmail_access_token";

interface GmailAccount {
  email: string;
  token: string;
}

const KNOWN_SERVICES: Record<string, { name: string; domain: string; category: string }> = {
  "netflix.com": { name: "Netflix", domain: "netflix.com", category: "streaming" },
  "spotify.com": { name: "Spotify", domain: "spotify.com", category: "music" },
  "adobe.com": { name: "Adobe", domain: "adobe.com", category: "design" },
  "apple.com": { name: "Apple", domain: "apple.com", category: "other" },
  "amazon.com": { name: "Amazon", domain: "amazon.com", category: "shopping" },
  "openai.com": { name: "OpenAI", domain: "openai.com", category: "productivity" },
  "notion.so": { name: "Notion", domain: "notion.so", category: "productivity" },
  "dropbox.com": { name: "Dropbox", domain: "dropbox.com", category: "storage" },
  "microsoft.com": { name: "Microsoft", domain: "microsoft.com", category: "productivity" },
  "google.com": { name: "Google", domain: "google.com", category: "storage" },
  "disney.com": { name: "Disney+", domain: "disney.com", category: "streaming" },
  "linkedin.com": { name: "LinkedIn", domain: "linkedin.com", category: "productivity" },
  "canva.com": { name: "Canva", domain: "canva.com", category: "design" },
  "grammarly.com": { name: "Grammarly", domain: "grammarly.com", category: "productivity" },
  "duolingo.com": { name: "Duolingo", domain: "duolingo.com", category: "education" },
};

const ALLOWED_CATEGORIES = new Set([
  "streaming", "music", "productivity", "design", "storage", "fitness",
  "education", "gaming", "news", "finance", "security", "shopping",
  "food", "utilities", "other",
]);

const PAYMENT_KEYWORDS = [
  "receipt", "invoice", "payment", "charge", "billing", "renewal",
  "subscription confirmed", "subscription", "order confirmation", "purchase",
  "amount due", "your membership", "your plan",
  "your receipt", "your payment", "payment for", "thanks for your payment",
  "payment successful", "subscription active", "premium receipt",
  "your order", "order receipt", "monthly payment", "annual payment",
  "auto-renewal", "autorenewal", "auto renewal",
  "successfully renewed", "subscription renewed",
  "thank you for your purchase", "factura", "rechnung", "reçu",
];

const PROMO_KEYWORDS = [
  "offer", "discount", "sale", "free", "try", "miss you", "come back",
  "streak", "reminder", "limited time", "exclusive",
];

const SAVINGS_KEYWORDS = [
  "% off", "discount", "save", "deal", "offer", "limited time",
  "special price", "upgrade for less", "reduced",
  "promoción", "angebot", "promo",
];

const FUZZY_BRANDS = [
  "spotify", "apple", "google", "microsoft", "amazon", "netflix", "adobe",
  "paypal", "stripe", "notion", "dropbox", "slack", "zoom", "discord",
  "linkedin", "canva", "grammarly", "duolingo", "github", "figma",
];

const BILLING_SENDER_PATTERNS = [
  "billing", "noreply", "no-reply", "no_reply", "receipts", "invoice", "payments", "notify",
];

const QUERY =
  "subject:receipt OR subject:invoice OR subject:subscription OR subject:renewal OR from:netflix.com OR from:spotify.com OR from:adobe.com OR from:apple.com OR from:amazon.com OR from:openai.com OR from:notion.so OR from:dropbox.com OR from:microsoft.com OR from:google.com OR from:disney.com OR from:linkedin.com OR from:canva.com OR from:grammarly.com OR from:duolingo.com";

interface Detected {
  domain: string;
  name: string;
  category: string;
  count: number;
  subjects: string[];
  matchedKeyword?: string;
  matchedSender?: string;
  earliestDate?: number; // ms
  latestDate?: number;
  latestSubject?: string;
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

const extractEmail = (from: string): string => {
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim().toLowerCase();
};

const extractDomain = (from: string): string | null => {
  const email = extractEmail(from);
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const domain = email.slice(at + 1).replace(/>$/, "");
  for (const known of Object.keys(KNOWN_SERVICES)) {
    if (domain === known || domain.endsWith("." + known)) return known;
  }
  // Fuzzy brand matching: any domain CONTAINING a known brand maps to that brand
  for (const brand of FUZZY_BRANDS) {
    if (domain.includes(brand)) {
      const canonical = `${brand}.com`;
      // Prefer the canonical domain key if known, else just return canonical
      return KNOWN_SERVICES[canonical] ? canonical : canonical;
    }
  }
  return domain;
};

const readAccounts = (): GmailAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((a) => a?.email && a?.token);
    }
  } catch {}
  const legacy = localStorage.getItem(LEGACY_TOKEN_KEY);
  if (legacy) {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    const migrated: GmailAccount[] = [{ email: "Connected account", token: legacy }];
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(migrated));
    return migrated;
  }
  return [];
};

const writeAccounts = (accounts: GmailAccount[]) => {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

const fetchEmailForToken = async (token: string): Promise<string> => {
  const r = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`Profile fetch failed (${r.status})`);
  const j = await r.json();
  return j.emailAddress as string;
};

const formatMonthYear = (ms: number) => {
  const d = new Date(ms);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const findKeyword = (subject: string): string | undefined => {
  const lower = subject.toLowerCase();
  return PAYMENT_KEYWORDS.find((k) => lower.includes(k));
};

const GmailGSIDetect = () => {
  const { addSubscription } = useSubscriptions();
  const [accounts, setAccounts] = useState<GmailAccount[]>(() => readAccounts());
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState("");
  const [detected, setDetected] = useState<Detected[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showUnlikely, setShowUnlikely] = useState(false);

  useEffect(() => {
    loadGsi().catch(() => {
      toast({ title: "Failed to load Google library", variant: "destructive" });
    });
  }, []);

  const persistAccounts = (next: GmailAccount[]) => {
    writeAccounts(next);
    setAccounts(next);
  };

  const disconnect = (email: string) => {
    const next = accounts.filter((a) => a.email !== email);
    persistAccounts(next);
    if (next.length === 0) setDetected([]);
    toast({ title: `${email} disconnected` });
  };

  const scanOne = async (
    accessToken: string,
    email: string,
    groups: Map<string, Detected>,
    onExpire: () => void
  ): Promise<boolean> => {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=${encodeURIComponent(
      QUERY
    )}`;
    const listRes = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (listRes.status === 401) {
      onExpire();
      return false;
    }
    if (!listRes.ok) throw new Error(`Gmail API ${listRes.status}`);
    const list = await listRes.json();
    const ids: string[] = (list.messages || []).map((m: any) => m.id);

    for (let i = 0; i < ids.length; i++) {
      setProgress(`${email}: reading ${i + 1} / ${ids.length}`);
      const r = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${ids[i]}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (r.status === 401) {
        onExpire();
        return false;
      }
      if (!r.ok) continue;
      const msg = await r.json();
      const headers: Array<{ name: string; value: string }> = msg.payload?.headers || [];
      const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
      const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "";
      const dateHeader = headers.find((h) => h.name.toLowerCase() === "date")?.value;
      const internalMs = msg.internalDate ? Number(msg.internalDate) : undefined;
      const dateMs = internalMs ?? (dateHeader ? Date.parse(dateHeader) : NaN);
      const domain = extractDomain(from);
      if (!domain) continue;
      const known = KNOWN_SERVICES[domain];
      const name =
        known?.name || domain.split(".")[0].replace(/^\w/, (c) => c.toUpperCase());
      const rawCategory = known?.category || "other";
      const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : "other";
      const sender = extractEmail(from);
      const matchedKeyword = findKeyword(subject);

      const existing = groups.get(domain);
      if (existing) {
        existing.count++;
        existing.subjects.push(subject);
        if (matchedKeyword && !existing.matchedKeyword) {
          existing.matchedKeyword = matchedKeyword;
          existing.matchedSender = sender;
        }
        if (Number.isFinite(dateMs)) {
          if (!existing.earliestDate || dateMs < existing.earliestDate) existing.earliestDate = dateMs;
          if (!existing.latestDate || dateMs > existing.latestDate) {
            existing.latestDate = dateMs;
            existing.latestSubject = subject;
          }
        }
      } else {
        groups.set(domain, {
          domain,
          name,
          category,
          count: 1,
          subjects: [subject],
          matchedKeyword,
          matchedSender: matchedKeyword ? sender : undefined,
          earliestDate: Number.isFinite(dateMs) ? dateMs : undefined,
          latestDate: Number.isFinite(dateMs) ? dateMs : undefined,
          latestSubject: subject,
        });
      }
    }
    return true;
  };

  const scanAll = async (list: GmailAccount[]) => {
    if (list.length === 0) return;
    setScanning(true);
    setProgress(`Scanning ${list.length} account${list.length === 1 ? "" : "s"}...`);
    const groups = new Map<string, Detected>();
    let current = [...list];
    try {
      for (let i = 0; i < list.length; i++) {
        const acc = list[i];
        setProgress(`Scanning ${list.length} account${list.length === 1 ? "" : "s"}... (${i + 1}/${list.length}) ${acc.email}`);
        const ok = await scanOne(acc.token, acc.email, groups, () => {
          current = current.filter((a) => a.email !== acc.email);
          persistAccounts(current);
          toast({
            title: `${acc.email} session expired`,
            description: "Please reconnect this account",
            variant: "destructive",
          });
        });
        if (!ok) continue;
      }
      // Deduplicated by domain via Map; keep all groups so we can classify into 3 buckets
      const all = Array.from(groups.values()).sort((a, b) => b.count - a.count);
      setDetected(all);
      toast({
        title: "Scan complete",
        description: `Detected ${all.length} service${all.length === 1 ? "" : "s"} across ${list.length} account${list.length === 1 ? "" : "s"}`,
      });
    } catch (e: any) {
      toast({ title: "Scan failed", description: e.message, variant: "destructive" });
    } finally {
      setScanning(false);
      setProgress("");
    }
  };

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
            const email = await fetchEmailForToken(resp.access_token);
            const existing = accounts.find((a) => a.email === email);
            const next = existing
              ? accounts.map((a) =>
                  a.email === email ? { ...a, token: resp.access_token } : a
                )
              : [...accounts, { email, token: resp.access_token }];
            persistAccounts(next);
            toast({ title: existing ? `${email} reconnected` : `${email} connected` });
            scanAll(next);
          } catch (e: any) {
            toast({
              title: "Failed to read account email",
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

  const handleConfirm = async (d: Detected) => {
    try {
      const startDate = d.earliestDate
        ? new Date(d.earliestDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      await addSubscription({
        name: d.name,
        price: 0,
        billing_cycle: "monthly",
        category: ALLOWED_CATEGORIES.has(d.category) ? d.category : "other",
        start_date: startDate,
        next_billing_date: next.toISOString().split("T")[0],
        status: "active",
      });
      setDismissed((s) => new Set(s).add(d.domain));
      toast({ title: `${d.name} added` });
    } catch (e: any) {
      toast({ title: "Failed to add", description: e.message, variant: "destructive" });
    }
  };

  const toggleExpand = (domain: string) => {
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(domain)) n.delete(domain);
      else n.add(domain);
      return n;
    });
  };

  const confidenceFor = (d: Detected): { level: "High" | "Medium" | "Low"; reason: string } => {
    const keywordCount = d.subjects.filter((s) => findKeyword(s)).length;
    if (d.count >= 3 && keywordCount >= 2) {
      return {
        level: "High",
        reason: `${d.count} emails found${d.matchedSender ? ` from ${d.matchedSender}` : ""}${d.matchedKeyword ? ` with subject containing "${d.matchedKeyword}"` : ""}`,
      };
    }
    if (keywordCount >= 1) {
      return {
        level: "Medium",
        reason: `${d.count} email${d.count === 1 ? "" : "s"}, ${keywordCount} matching payment keyword${keywordCount === 1 ? "" : "s"}${d.matchedKeyword ? ` ("${d.matchedKeyword}")` : ""}`,
      };
    }
    return {
      level: "Low",
      reason: `${d.count} email${d.count === 1 ? "" : "s"}, no payment keywords matched`,
    };
  };

  const isPromoSubject = (s: string) => {
    const lower = s.toLowerCase();
    return PROMO_KEYWORDS.some((k) => lower.includes(k));
  };

  const isBillingSender = (sender?: string) => {
    if (!sender) return false;
    const local = sender.split("@")[0]?.toLowerCase() || "";
    return BILLING_SENDER_PATTERNS.some((p) => local.includes(p));
  };

  type Bucket = "confirmed" | "possibly" | "unlikely";
  const classify = (d: Detected): Bucket => {
    const hasPaymentKw = d.subjects.some((s) => findKeyword(s));
    const allPromo = d.subjects.length > 0 && d.subjects.every((s) => isPromoSubject(s));
    if (hasPaymentKw && isBillingSender(d.matchedSender)) return "confirmed";
    if (allPromo && !hasPaymentKw) return "unlikely";
    if (!hasPaymentKw || d.count === 1) return "possibly";
    return "possibly";
  };

  const visible = detected.filter((d) => !dismissed.has(d.domain));
  const confirmedList = visible.filter((d) => classify(d) === "confirmed");
  const possiblyList = visible.filter((d) => classify(d) === "possibly");
  const unlikelyList = visible.filter((d) => classify(d) === "unlikely");
  const hasAccounts = accounts.length > 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Gmail Subscription Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasAccounts ? (
            <>
              <div className="space-y-2">
                {accounts.map((acc) => (
                  <div
                    key={acc.email}
                    className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
                        {acc.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => disconnect(acc.email)}
                      className="gap-1 text-destructive hover:text-destructive shrink-0"
                    >
                      <Unplug className="h-3.5 w-3.5" /> Disconnect
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => scanAll(accounts)}
                  disabled={scanning}
                  className="gap-2 bg-gradient-primary hover:opacity-90"
                >
                  {scanning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {scanning ? "Scanning..." : detected.length ? "Scan again" : "Scan inbox"}
                </Button>
                <Button onClick={connect} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Connect another account
                </Button>
              </div>
              {scanning && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{progress}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Connect Gmail to auto-detect</p>
                  <p className="text-xs text-muted-foreground">
                    Connect one or more Gmail accounts. We scan recent receipts, invoices and subscription emails.
                  </p>
                </div>
              </div>
              <Button onClick={connect} className="gap-2 bg-gradient-primary hover:opacity-90">
                <Mail className="h-4 w-4" /> Connect Gmail
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {visible.length > 0 && (
        <div className="space-y-6">
          {renderSection({
            title: "Confirmed subscriptions",
            items: confirmedList,
            badgeLabel: "Confirmed",
            badgeClass: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800",
            icon: <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />,
          })}
          {renderSection({
            title: "Possibly subscriptions",
            items: possiblyList,
            badgeLabel: "Possibly",
            badgeClass: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
            icon: <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
          })}
          {unlikelyList.length > 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <button
                  type="button"
                  onClick={() => setShowUnlikely((v) => !v)}
                  className="flex w-full items-center justify-between"
                >
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <MinusCircle className="h-5 w-5 text-muted-foreground" />
                    {showUnlikely ? `Probably not a subscription (${unlikelyList.length})` : `Show unlikely (${unlikelyList.length})`}
                  </CardTitle>
                  {showUnlikely ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
              </CardHeader>
              {showUnlikely && (
                <CardContent>
                  {renderCardGrid(unlikelyList, "Unlikely", "bg-muted text-muted-foreground border-border")}
                </CardContent>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );

  function renderSection({
    title,
    items,
    badgeLabel,
    badgeClass,
    icon,
  }: {
    title: string;
    items: Detected[];
    badgeLabel: string;
    badgeClass: string;
    icon: React.ReactNode;
  }) {
    if (items.length === 0) return null;
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            {icon}
            {title} ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>{renderCardGrid(items, badgeLabel, badgeClass)}</CardContent>
      </Card>
    );
  }

  function renderCardGrid(items: Detected[], badgeLabel: string, badgeClass: string) {
    return (
      <AnimatePresence>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((sub) => {
            const { level, reason } = confidenceFor(sub);
            const isOpen = expanded.has(sub.domain);
            return (
              <motion.div
                key={sub.domain}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-border p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={`https://logo.clearbit.com/${sub.domain}`}
                      alt={sub.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                      className="h-9 w-9 rounded-lg object-contain bg-muted p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{sub.name}</p>
                      {sub.earliestDate && (
                        <p className="text-xs text-muted-foreground truncate">
                          First seen: {formatMonthYear(sub.earliestDate)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {sub.count} email{sub.count === 1 ? "" : "s"} · {sub.domain}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${badgeClass}`}>
                    {badgeLabel}
                  </Badge>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(sub.domain)}
                  className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Why detected?</span>
                  {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {isOpen && (
                  <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-xs">
                    <p>
                      <span className="font-medium">Emails found:</span> {sub.count}
                    </p>
                    <p>
                      <span className="font-medium">Confidence:</span> {level} — {reason}
                    </p>
                    {sub.latestSubject && (
                      <p className="truncate">
                        <span className="font-medium">Most recent subject:</span> {sub.latestSubject}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleConfirm(sub)}
                    className="flex-1 gap-1 bg-gradient-primary hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
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
    );
  }
};

export default GmailGSIDetect;
