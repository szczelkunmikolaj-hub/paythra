import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Search, Unplug, CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const CLIENT_ID =
  "640863753608-e2g9mvhohjvh6p6q9nee5tpv5vq1bce5.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const TOKEN_KEY = "gmail_access_token";

const KNOWN_SERVICES: Record<string, { name: string; domain: string }> = {
  "netflix.com": { name: "Netflix", domain: "netflix.com" },
  "spotify.com": { name: "Spotify", domain: "spotify.com" },
  "adobe.com": { name: "Adobe", domain: "adobe.com" },
  "apple.com": { name: "Apple", domain: "apple.com" },
  "amazon.com": { name: "Amazon", domain: "amazon.com" },
  "openai.com": { name: "OpenAI", domain: "openai.com" },
  "notion.so": { name: "Notion", domain: "notion.so" },
  "dropbox.com": { name: "Dropbox", domain: "dropbox.com" },
  "microsoft.com": { name: "Microsoft", domain: "microsoft.com" },
  "google.com": { name: "Google", domain: "google.com" },
  "disney.com": { name: "Disney+", domain: "disney.com" },
  "linkedin.com": { name: "LinkedIn", domain: "linkedin.com" },
  "canva.com": { name: "Canva", domain: "canva.com" },
  "grammarly.com": { name: "Grammarly", domain: "grammarly.com" },
  "duolingo.com": { name: "Duolingo", domain: "duolingo.com" },
};

const QUERY =
  "subject:receipt OR subject:invoice OR subject:subscription OR subject:renewal OR from:netflix.com OR from:spotify.com OR from:adobe.com OR from:apple.com OR from:amazon.com OR from:openai.com OR from:notion.so OR from:dropbox.com OR from:microsoft.com OR from:google.com OR from:disney.com OR from:linkedin.com OR from:canva.com OR from:grammarly.com OR from:duolingo.com";

interface Detected {
  domain: string;
  name: string;
  count: number;
  lastSubject?: string;
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

const GmailGSIDetect = () => {
  const { addSubscription } = useSubscriptions();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState("");
  const [detected, setDetected] = useState<Detected[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadGsi().catch(() => {
      toast({ title: "Failed to load Google library", variant: "destructive" });
    });
  }, []);

  const disconnect = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setDetected([]);
    toast({ title: "Gmail disconnected" });
  };

  const scan = async (accessToken: string) => {
    setScanning(true);
    setProgress("Searching emails...");
    try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=${encodeURIComponent(
        QUERY
      )}`;
      const listRes = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (listRes.status === 401) {
        disconnect();
        toast({ title: "Session expired, please reconnect", variant: "destructive" });
        return;
      }
      if (!listRes.ok) throw new Error(`Gmail API ${listRes.status}`);
      const list = await listRes.json();
      const ids: string[] = (list.messages || []).map((m: any) => m.id);

      const groups = new Map<string, Detected>();
      for (let i = 0; i < ids.length; i++) {
        setProgress(`Reading email ${i + 1} / ${ids.length}`);
        const r = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${ids[i]}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (r.status === 401) {
          disconnect();
          return;
        }
        if (!r.ok) continue;
        const msg = await r.json();
        const headers: Array<{ name: string; value: string }> =
          msg.payload?.headers || [];
        const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
        const subject =
          headers.find((h) => h.name.toLowerCase() === "subject")?.value || "";
        const domain = extractDomain(from);
        if (!domain) continue;
        const known = KNOWN_SERVICES[domain];
        const name = known?.name || domain.split(".")[0].replace(/^\w/, (c) => c.toUpperCase());
        const existing = groups.get(domain);
        if (existing) existing.count++;
        else groups.set(domain, { domain, name, count: 1, lastSubject: subject });
      }
      setDetected(Array.from(groups.values()).sort((a, b) => b.count - a.count));
      toast({
        title: "Scan complete",
        description: `Detected ${groups.size} subscription${groups.size === 1 ? "" : "s"}`,
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
        callback: (resp: any) => {
          if (resp.error || !resp.access_token) {
            toast({
              title: "Authorization failed",
              description: resp.error || "No token returned",
              variant: "destructive",
            });
            return;
          }
          localStorage.setItem(TOKEN_KEY, resp.access_token);
          setToken(resp.access_token);
          scan(resp.access_token);
        },
      });
      tokenClient.requestAccessToken();
    } catch (e: any) {
      toast({ title: "Failed to start auth", description: e.message, variant: "destructive" });
    }
  };

  const handleConfirm = async (d: Detected) => {
    try {
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      await addSubscription({
        name: d.name,
        price: 0,
        billing_cycle: "monthly",
        category: "entertainment",
        next_billing_date: next.toISOString().split("T")[0],
        status: "active",
      });
      setDismissed((s) => new Set(s).add(d.domain));
      toast({ title: `${d.name} added` });
    } catch (e: any) {
      toast({ title: "Failed to add", description: e.message, variant: "destructive" });
    }
  };

  const visible = detected.filter((d) => !dismissed.has(d.domain));

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
          {token ? (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Gmail connected
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => scan(token)}
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
                <Button
                  variant="outline"
                  onClick={disconnect}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Unplug className="h-4 w-4" /> Disconnect Gmail
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
                    We scan recent receipts, invoices and subscription emails.
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
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Search className="h-5 w-5 text-primary" />
              Detected ({visible.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <div className="grid gap-3 sm:grid-cols-2">
                {visible.map((sub) => (
                  <motion.div
                    key={sub.domain}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl border border-border p-4 space-y-3"
                  >
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
                        <p className="text-xs text-muted-foreground truncate">
                          {sub.count} email{sub.count === 1 ? "" : "s"} · {sub.domain}
                        </p>
                      </div>
                    </div>
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
                        onClick={() =>
                          setDismissed((s) => new Set(s).add(sub.domain))
                        }
                        className="gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GmailGSIDetect;
