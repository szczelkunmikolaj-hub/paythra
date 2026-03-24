import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubscriptionForm from "@/components/dashboard/SubscriptionForm";
import ConnectAccounts from "@/components/dashboard/ConnectAccounts";
import AutoDetect from "@/components/dashboard/AutoDetect";
import { useSubscriptions, type Subscription } from "@/hooks/useSubscriptions";
import { useTransactions } from "@/hooks/useTransactions";
import { useTrialGuardian } from "@/hooks/useTrialGuardian";
import { useUnusedDetection } from "@/hooks/useUnusedDetection";
import { usePriceChangeDetection } from "@/hooks/usePriceChangeDetection";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CreditCard, Zap, Link2, Bell, Lock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { subscriptions, isLoading, addSubscription, updateSubscription } = useSubscriptions();
  const { transactions } = useTransactions();
  const { profile } = useProfile();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { plan, limits } = useUserPlan();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [sendingTest, setSendingTest] = useState(false);

  const atLimit = subscriptions.filter(s => s.status === "active").length >= limits.maxSubscriptions;

  useTrialGuardian(subscriptions);
  useUnusedDetection(subscriptions, transactions);
  usePriceChangeDetection(subscriptions);

  const active = subscriptions.filter((s) => s.status === "active");
  const monthly = active.reduce((sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12), 0);
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "there";

  const sendTestNotification = async () => {
    if (!user) return;
    setSendingTest(true);
    try {
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "upcoming_charge",
        message: "🔔 This is a test notification! Your notification system is working perfectly.",
      });
      toast({ title: t("testNotificationSent"), description: t("checkNotifications") });
    } catch {
      toast({ title: t("failedToSend"), variant: "destructive" });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-primary-foreground shadow-glow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10 text-center space-y-2">
            <h1 className="font-display text-3xl font-bold">
              {t("welcomeBackUser", { name: displayName })}
            </h1>
            <p className="text-primary-foreground/70 text-sm">{t("commandCenter")}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="mx-auto flex w-fit">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="autodetect" className="gap-1.5">
                <Search className="h-3.5 w-3.5" /> {t("autoDetect")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="flex flex-col items-center gap-2">
                <Button
                  size="lg"
                  onClick={() => {
                    if (atLimit) {
                      toast({ title: t("upgradeToTrackMore"), variant: "destructive" });
                      navigate("/pricing");
                      return;
                    }
                    setEditing(null);
                    setFormOpen(true);
                  }}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-2xl shadow-glow"
                >
                  <Plus className="mr-2 h-5 w-5" /> {t("addSubscription")}
                </Button>
                {atLimit && (
                  <button onClick={() => navigate("/pricing")} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Lock className="h-3 w-3" />
                    {t("upgradeToTrackMore")}
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
                <Card className="shadow-card">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-xl bg-primary/10 p-3"><CreditCard className="h-6 w-6 text-primary" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("monthlySpend")}</p>
                      <p className="text-2xl font-bold text-foreground">€{monthly.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-xl bg-primary/10 p-3"><Zap className="h-6 w-6 text-primary" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("activeSubscriptions")}</p>
                      <p className="text-2xl font-bold text-foreground">{active.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card sm:col-span-2 lg:col-span-1">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-xl bg-primary/10 p-3"><Link2 className="h-6 w-6 text-primary" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("connectedAccounts")}</p>
                      <p className="text-2xl font-bold text-foreground">0</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={sendTestNotification} disabled={sendingTest} className="gap-2">
                  <Bell className="h-4 w-4" />
                  {sendingTest ? t("sendingNotification") : t("sendTestNotification")}
                </Button>
              </div>

              <ConnectAccounts />
            </TabsContent>

            <TabsContent value="autodetect">
              <AutoDetect />
            </TabsContent>
          </Tabs>
        )}

        <SubscriptionForm open={formOpen} onOpenChange={setFormOpen} onSubmit={addSubscription} onUpdate={updateSubscription} editing={editing} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
