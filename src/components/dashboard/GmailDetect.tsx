import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Search, Unplug, CheckCircle2, AlertCircle, Loader2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  startGmailAuth,
  loadToken,
  disconnectGmail,
  getConnectedEmail,
} from "@/lib/gmailPKCE";
import {
  fetchEmailsLast90Days,
  groupRecurring,
  saveDetected,
  loadDetected,
  dismissMerchant,
  getDismissed,
  recordConfirmed,
  getConfirmed,
  type DetectedSubscription,
} from "@/lib/gmailScanner";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const GmailDetect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addSubscription } = useSubscriptions();

  const [token, setToken] = useState(loadToken());
  const [email, setEmail] = useState(getConnectedEmail());
  const [detected, setDetected] = useState<DetectedSubscription[]>(loadDetected());
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState("");
  const [dismissed, setDismissed] = useState<string[]>(getDismissed());
  const [confirmed, setConfirmed] = useState<string[]>(getConfirmed());

  const isConnected = !!token;

  const handleScan = async () => {
    const t = loadToken();
    if (!t) {
      toast({ title: "Not connected", description: "Connect Gmail first.", variant: "destructive" });
      return;
    }
    setScanning(true);
    setProgress("Starting scan…");
    try {
      const emails = await fetchEmailsLast90Days(t.access_token, setProgress);
      const groups = groupRecurring(emails);
      saveDetected(groups);
      setDetected(groups);
      toast({
        title: "Scan complete",
        description: `${groups.length} recurring subscription${groups.length === 1 ? "" : "s"} detected.`,
      });
    } catch (e: any) {
      // 401 → token expired
      if (String(e.message).includes("401")) {
        disconnectGmail();
        setToken(null);
        toast({ title: "Session expired", description: "Please reconnect Gmail.", variant: "destructive" });
      } else {
        toast({ title: "Scan failed", description: e.message, variant: "destructive" });
      }
    } finally {
      setScanning(false);
      setProgress("");
    }
  };

  // Auto-scan after redirect from /auth/callback
  useEffect(() => {
    if (searchParams.get("scan") === "1" && isConnected && !scanning) {
      const cleanup = setTimeout(() => {
        handleScan();
        searchParams.delete("scan");
        setSearchParams(searchParams, { replace: true });
      }, 200);
      return () => clearTimeout(cleanup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handleDisconnect = () => {
    disconnectGmail();
    setToken(null);
    setEmail(null);
    setDetected([]);
    saveDetected([]);
    toast({ title: "Gmail disconnected" });
  };

  const handleConfirm = async (sub: DetectedSubscription) => {
    try {
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      await addSubscription({
        name: sub.merchant,
        price: sub.amount,
        billing_cycle: sub.frequency === "yearly" ? "yearly" : "monthly",
        category: "entertainment",
        next_billing_date: next.toISOString().split("T")[0],
        status: "active",
      });
      recordConfirmed(sub.domain);
      setConfirmed((c) => [...c, sub.domain]);
      toast({ title: `${sub.merchant} added to your subscriptions` });
    } catch (e: any) {
      toast({ title: "Failed to add", description: e.message, variant: "destructive" });
    }
  };

  const handleDismiss = (sub: DetectedSubscription) => {
    dismissMerchant(sub.domain);
    setDismissed((d) => [...d, sub.domain]);
  };

  const visible = detected.filter(
    (d) => !dismissed.includes(d.domain) && !confirmed.includes(d.domain)
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Gmail subscription detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Gmail connected
                  </p>
                  {email && <p className="text-xs text-green-600 dark:text-green-500">{email}</p>}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleScan} disabled={scanning} className="gap-2 bg-gradient-primary hover:opacity-90">
                  {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {scanning ? "Scanning…" : "Scan last 90 days"}
                </Button>
                <Button variant="outline" onClick={handleDisconnect} className="gap-2 text-destructive hover:text-destructive">
                  <Unplug className="h-4 w-4" /> Disconnect
                </Button>
              </div>
              {progress && <p className="text-xs text-muted-foreground">{progress}</p>}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Gmail not connected</p>
                  <p className="text-xs text-muted-foreground">
                    We'll scan emails from the last 90 days to find recurring subscriptions.
                  </p>
                </div>
              </div>
              <Button onClick={startGmailAuth} className="gap-2 bg-gradient-primary hover:opacity-90">
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
              Detected subscriptions ({visible.length})
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
                    <div>
                      <p className="font-semibold">{sub.merchant}</p>
                      <p className="text-xs text-muted-foreground">{sub.domain}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {sub.currency === "GBP" ? "£" : sub.currency === "USD" ? "$" : "€"}
                        {sub.amount.toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {sub.frequency === "unknown" ? `${sub.occurrences}× seen` : sub.frequency}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleConfirm(sub)} className="flex-1 gap-1 bg-gradient-primary hover:opacity-90">
                        <Plus className="h-3.5 w-3.5" /> Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDismiss(sub)} className="gap-1">
                        <X className="h-3.5 w-3.5" /> Dismiss
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {isConnected && detected.length > 0 && visible.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-sm text-muted-foreground">All detected subscriptions reviewed.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GmailDetect;
