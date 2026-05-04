import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Search, Unplug, CheckCircle2, AlertCircle, Loader2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  startGmailAuth,
  getAccessToken,
  isGmailConnected,
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
  appendPaythraSubscription,
  type DetectedSubscription,
} from "@/lib/gmailScanner";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const GmailDetect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addSubscription } = useSubscriptions();
  const { t } = useTranslation();

  const [connected, setConnected] = useState(isGmailConnected());
  const [email, setEmail] = useState(getConnectedEmail());
  const [detected, setDetected] = useState<DetectedSubscription[]>(loadDetected());
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState("");
  const [dismissed, setDismissed] = useState<string[]>(getDismissed());
  const [confirmed, setConfirmed] = useState<string[]>(getConfirmed());

  const handleScan = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      toast({
        title: t("gmailSessionExpired"),
        description: t("reconnectGmail"),
        variant: "destructive",
      });
      setConnected(false);
      return;
    }
    setScanning(true);
    setProgress(t("scanningEmailsForSubscriptions"));
    try {
      const emails = await fetchEmailsLast90Days(accessToken, setProgress);
      const groups = groupRecurring(emails);
      saveDetected(groups);
      setDetected(groups);
      toast({
        title: t("scanComplete"),
        description: t("detectedSubscriptionsCount", { count: groups.length }),
      });
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes("401") || msg.toLowerCase().includes("invalid")) {
        disconnectGmail();
        setConnected(false);
        setEmail(null);
        toast({
          title: t("gmailSessionExpired"),
          description: t("reconnectGmail"),
          variant: "destructive",
        });
      } else {
        toast({ title: t("scanFailed"), description: msg, variant: "destructive" });
      }
    } finally {
      setScanning(false);
      setProgress("");
    }
  };

  // Auto-scan after redirect from /auth/callback (?scan=1)
  useEffect(() => {
    if (searchParams.get("scan") === "1" && connected && !scanning) {
      const timer = setTimeout(() => {
        handleScan();
        searchParams.delete("scan");
        setSearchParams(searchParams, { replace: true });
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const handleConnectClick = () => {
    if (isGmailConnected()) {
      // Already connected → skip OAuth, scan immediately
      handleScan();
    } else {
      startGmailAuth();
    }
  };

  const handleDisconnect = () => {
    disconnectGmail();
    setConnected(false);
    setEmail(null);
    setDetected([]);
    saveDetected([]);
    toast({ title: t("gmailDisconnected") });
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
      appendPaythraSubscription(sub);
      recordConfirmed(sub.domain);
      setConfirmed((c) => [...c, sub.domain]);
      toast({ title: t("merchantAddedToSubscriptions", { merchant: sub.merchant }) });
    } catch (e: any) {
      toast({ title: t("failedToAdd"), description: e.message, variant: "destructive" });
    }
  };

  const handleDismiss = (sub: DetectedSubscription) => {
    dismissMerchant(sub.domain);
    setDismissed((d) => [...d, sub.domain]);
  };

  const visible = detected.filter(
    (d) => !dismissed.includes(d.domain) && !confirmed.includes(d.domain)
  );

  const confidenceVariant = (c: number): "default" | "secondary" | "outline" => {
    if (c >= 90) return "default";
    if (c >= 70) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Mail className="h-5 w-5 text-primary" />
            {t("gmailSubscriptionDetection")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {connected ? (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    {t("gmailConnected")}
                  </p>
                  {email && <p className="text-xs text-green-600 dark:text-green-500">{email}</p>}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  className="gap-2 bg-gradient-primary hover:opacity-90"
                >
                  {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {scanning ? t("scanning") : detected.length > 0 ? t("scanAgain") : t("scanLast90Days")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Unplug className="h-4 w-4" /> {t("disconnect")}
                </Button>
              </div>
              {scanning && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{progress || t("scanningEmailsForSubscriptions")}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{t("gmailNotConnectedTitle")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("gmailScanLast90DaysHint")}
                  </p>
                </div>
              </div>
              <Button onClick={handleConnectClick} className="gap-2 bg-gradient-primary hover:opacity-90">
                <Mail className="h-4 w-4" /> {t("connectGmail")}
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
              {t("detectedSubscriptionsTitle", { count: visible.length })}
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={`https://logo.clearbit.com/${sub.domain}`}
                          alt={`${sub.merchant} logo`}
                          loading="lazy"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                          className="h-9 w-9 rounded-lg object-contain bg-muted p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{sub.merchant}</p>
                          <p className="text-xs text-muted-foreground truncate">{sub.domain}</p>
                        </div>
                      </div>
                      <Badge variant={confidenceVariant(sub.confidence)} className="text-[10px] shrink-0">
                        {t("percentMatch", { count: sub.confidence })}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {sub.currency === "GBP" ? "£" : sub.currency === "USD" ? "$" : "€"}
                        {sub.amount.toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {sub.frequency === "unknown" ? t("timesSeen", { count: sub.occurrences }) : t(sub.frequency)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleConfirm(sub)}
                        className="flex-1 gap-1 bg-gradient-primary hover:opacity-90"
                      >
                        <Plus className="h-3.5 w-3.5" /> {t("confirmLabel")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismiss(sub)}
                        className="gap-1"
                      >
                        <X className="h-3.5 w-3.5" /> {t("dismissLabel")}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {connected && !scanning && detected.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <Mail className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("noSubscriptionsDetectedInbox")}</p>
          </CardContent>
        </Card>
      )}

      {connected && detected.length > 0 && visible.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-sm text-muted-foreground">{t("allDetectedSubscriptionsReviewed")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GmailDetect;
