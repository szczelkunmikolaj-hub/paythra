import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Search, Unplug, CheckCircle2, AlertCircle, Loader2, Plus, X } from "lucide-react";
import { useGmailConnection, type DetectedSubscription } from "@/hooks/useGmailConnection";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useUserPlan } from "@/hooks/useUserPlan";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const AutoDetect = () => {
  const { t } = useTranslation();
  const {
    connection,
    isConnected,
    isLoading,
    connectGmail,
    disconnectGmail,
    isDisconnecting,
    scanEmails,
    isScanning,
    scanResults,
  } = useGmailConnection();
  const { addSubscription } = useSubscriptions();
  const { plan } = useUserPlan();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<string>>(new Set());

  const isPremium = plan === "premium" || plan === "business";

  const handleScan = async () => {
    try {
      const results = await scanEmails();
      toast({
        title: t("scanComplete"),
        description: `${results.detected.length} ${t("subscriptionsDetected")}`,
      });
    } catch (e: any) {
      toast({ title: t("scanFailed"), description: e.message, variant: "destructive" });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectGmail();
      toast({ title: t("gmailDisconnected") });
    } catch {
      toast({ title: t("failedToDisconnect"), variant: "destructive" });
    }
  };

  const handleAdd = async (sub: DetectedSubscription) => {
    try {
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);
      await addSubscription({
        name: sub.name,
        price: sub.price || 0,
        billing_cycle: sub.billing_cycle,
        category: sub.category,
        next_billing_date: nextBilling.toISOString().split("T")[0],
        status: "active",
      });
      setAdded((s) => new Set(s).add(sub.name));
      toast({ title: `${sub.name} ${t("addedToSubscriptions")}` });
    } catch {
      toast({ title: t("failedToAdd"), variant: "destructive" });
    }
  };

  const detected = (scanResults?.detected || []).filter(
    (d) => !dismissed.has(d.name) && !added.has(d.name)
  );

  if (!isPremium) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <Mail className="h-12 w-12 text-muted-foreground" />
          <h3 className="font-display text-lg font-semibold">{t("autoDetectPremium")}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{t("autoDetectPremiumDesc")}</p>
          <Badge variant="secondary">{t("premiumFeature")}</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Mail className="h-5 w-5 text-primary" />
            {t("gmailAutoDetect")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> {t("checking")}...
            </div>
          ) : isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    {t("gmailConnected")}
                  </p>
                  {connection?.email && (
                    <p className="text-xs text-green-600 dark:text-green-500">{connection.email}</p>
                  )}
                  {connection?.last_scan_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("lastScan")}: {format(new Date(connection.last_scan_at), "PPp")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleScan} disabled={isScanning} className="gap-2 bg-gradient-primary hover:opacity-90">
                  {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {isScanning ? t("scanning") : t("scanEmails")}
                </Button>
                <Button variant="outline" onClick={handleDisconnect} disabled={isDisconnecting} className="gap-2 text-destructive hover:text-destructive">
                  <Unplug className="h-4 w-4" />
                  {t("disconnect")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("gmailNotConnected")}</p>
                  <p className="text-xs text-muted-foreground">{t("connectGmailDesc")}</p>
                </div>
              </div>
              <Button onClick={connectGmail} className="gap-2 bg-gradient-primary hover:opacity-90">
                <Mail className="h-4 w-4" /> {t("connectGmail")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected Subscriptions */}
      {detected.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Search className="h-5 w-5 text-primary" />
              {t("detectedSubscriptions")} ({detected.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <div className="space-y-3">
                {detected.map((sub) => (
                  <motion.div
                    key={sub.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center gap-4 rounded-xl border border-border p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.price ? `€${sub.price.toFixed(2)}` : t("priceUnknown")} · {sub.billing_cycle} · {sub.category}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{sub.source_email}</p>
                    </div>
                    <Badge variant={sub.confidence > 0.8 ? "default" : "secondary"} className="text-[10px]">
                      {Math.round(sub.confidence * 100)}%
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleAdd(sub)} className="h-8 w-8 p-0 text-green-600">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDismissed((s) => new Set(s).add(sub.name))}
                        className="h-8 w-8 p-0 text-muted-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Scan summary */}
      {scanResults && detected.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-sm text-muted-foreground">{t("noNewSubscriptions")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoDetect;
