import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import ForecastChart from "@/components/dashboard/ForecastChart";
import SavingsPanel from "@/components/dashboard/SavingsPanel";
import HealthScoreCard from "@/components/dashboard/HealthScoreCard";
import OverloadIndexCard from "@/components/dashboard/OverloadIndexCard";
import TrialCountdown from "@/components/dashboard/TrialCountdown";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useProfile } from "@/hooks/useProfile";
import { useSubscriptionIntelligence } from "@/hooks/useSubscriptionIntelligence";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Lightbulb, CreditCard, AlertTriangle } from "lucide-react";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { formatCurrency, convertFromEUR } from "@/lib/currency";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TimelineTab from "@/components/analytics/TimelineTab";
import WasteCalendarTab from "@/components/analytics/WasteCalendarTab";

const Analytics = () => {
  const { subscriptions, isLoading } = useSubscriptions();
  const { services } = useServicePricing();
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();
  const { limits } = useUserPlan();
  const lang = i18n.language;

  const { insights, totalSavings, healthScore, activeCount, monthlySpend, yearlyProjected } =
    useSubscriptionIntelligence({ subscriptions, services, isStudent: profile?.is_student ?? false, monthlyIncome: profile?.monthly_income ?? null });

  const unusedCount = subscriptions.filter((s) => s.is_unused).length;
  const active = subscriptions.filter((s) => s.status === "active");

  const categorySpending = active.reduce<Record<string, number>>((acc, s) => {
    const cat = s.category || "other";
    const monthlyPrice = s.billing_cycle === "monthly" ? s.price : s.price / 12;
    acc[cat] = (acc[cat] || 0) + monthlyPrice;
    return acc;
  }, {});

  const categoryBarData = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: Math.round(convertFromEUR(amount, lang) * 100) / 100,
      fill: getCategoryIcon(category).hexColor,
    }))
    .sort((a, b) => b.amount - a.amount);

  const symbol = formatCurrency(0, lang).replace(/[\d.,\s]/g, "").trim();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("insightsAnalytics")}</h1>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">My Timeline</TabsTrigger>
            <TabsTrigger value="waste">Waste Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineTab />
          </TabsContent>
          <TabsContent value="waste">
            <WasteCalendarTab />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">


        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-primary/10 p-2"><CreditCard className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("monthlySpend")}</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(monthlySpend, lang)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-primary/10 p-2"><TrendingUp className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("yearlyTotal")}</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(yearlyProjected, lang)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-primary/10 p-2"><Target className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("activeSubs")}</p>
                    <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-destructive/10 p-2"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("unusedAlerts")}</p>
                    <p className="text-2xl font-bold text-foreground">{unusedCount}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {totalSavings > 0 && (
              <Card className="border-green-200 shadow-card dark:border-green-800/30">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-green-100 p-2 dark:bg-green-900/30">
                    <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("potentialSavings")}</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalSavings, lang)}/{t("perYear").replace("/", "")}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <HealthScoreCard score={healthScore} monthlySpend={monthlySpend} monthlyIncome={profile?.monthly_income ?? null} activeCount={activeCount} unusedCount={unusedCount} />
              <OverloadIndexCard activeCount={activeCount} />
            </div>

            <TrialCountdown subscriptions={subscriptions} />

            {categoryBarData.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">{t("spendingByCategory")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryBarData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" tickFormatter={(v) => `${symbol}${v}`} fontSize={12} />
                      <YAxis type="category" dataKey="category" fontSize={12} width={100} />
                      <Tooltip formatter={(v: number) => formatCurrency(v, lang)} />
                      <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                        {categoryBarData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {limits.advancedAnalytics ? (
              <>
                <ForecastChart subscriptions={subscriptions} />
                <div className="grid gap-6 lg:grid-cols-2">
                  <SpendingChart subscriptions={subscriptions} />
                  <CategoryChart subscriptions={subscriptions} />
                </div>
                <SavingsPanel insights={insights} totalSavings={totalSavings} />
              </>
            ) : (
              <UpgradePrompt feature={t("planBusinessF6")} requiredPlan="business" />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
