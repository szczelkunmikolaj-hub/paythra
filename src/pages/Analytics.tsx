import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import ForecastChart from "@/components/dashboard/ForecastChart";
import SavingsPanel from "@/components/dashboard/SavingsPanel";
import HealthScoreCard from "@/components/dashboard/HealthScoreCard";
import OverloadIndexCard from "@/components/dashboard/OverloadIndexCard";
import TrialCountdown from "@/components/dashboard/TrialCountdown";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useProfile } from "@/hooks/useProfile";
import { useSubscriptionIntelligence } from "@/hooks/useSubscriptionIntelligence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Target, Lightbulb, CreditCard, AlertTriangle } from "lucide-react";
import { getCategoryIcon } from "@/lib/categoryIcons";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const Analytics = () => {
  const { subscriptions, isLoading } = useSubscriptions();
  const { services } = useServicePricing();
  const { profile } = useProfile();

  const { insights, totalSavings, healthScore, activeCount, monthlySpend, yearlyProjected } =
    useSubscriptionIntelligence({
      subscriptions,
      services,
      isStudent: profile?.is_student ?? false,
      monthlyIncome: profile?.monthly_income ?? null,
    });

  const unusedCount = subscriptions.filter((s) => s.is_unused).length;
  const active = subscriptions.filter((s) => s.status === "active");

  // Category spending data
  const categorySpending = active.reduce<Record<string, number>>((acc, s) => {
    const cat = s.category || "other";
    const monthlyPrice = s.billing_cycle === "monthly" ? s.price : s.price / 12;
    acc[cat] = (acc[cat] || 0) + monthlyPrice;
    return acc;
  }, {});

  const categoryBarData = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: Math.round(amount * 100) / 100,
      fill: getCategoryIcon(category).hexColor,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Insights & Analytics</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Financial Overview */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-primary/10 p-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Spend</p>
                    <p className="text-2xl font-bold text-foreground">€{monthlySpend.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-primary/10 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Yearly Total</p>
                    <p className="text-2xl font-bold text-foreground">€{yearlyProjected.toFixed(0)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-primary/10 p-2">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Subs</p>
                    <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-destructive/10 p-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unused Alerts</p>
                    <p className="text-2xl font-bold text-foreground">{unusedCount}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Savings */}
            {totalSavings > 0 && (
              <Card className="border-green-200 shadow-card dark:border-green-800/30">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-xl bg-green-100 p-2 dark:bg-green-900/30">
                    <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Potential Savings</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">€{totalSavings.toFixed(0)}/yr</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Health & Overload */}
            <div className="grid gap-4 sm:grid-cols-2">
              <HealthScoreCard
                score={healthScore}
                monthlySpend={monthlySpend}
                monthlyIncome={profile?.monthly_income ?? null}
                activeCount={activeCount}
                unusedCount={unusedCount}
              />
              <OverloadIndexCard activeCount={activeCount} />
            </div>

            {/* Trial Protection */}
            <TrialCountdown subscriptions={subscriptions} />

            {/* Spending by Category Bars */}
            {categoryBarData.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryBarData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" tickFormatter={(v) => `€${v}`} fontSize={12} />
                      <YAxis type="category" dataKey="category" fontSize={12} width={100} />
                      <Tooltip formatter={(v: number) => `€${v.toFixed(2)}`} />
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

            {/* Forecast */}
            <ForecastChart subscriptions={subscriptions} />

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SpendingChart subscriptions={subscriptions} />
              <CategoryChart subscriptions={subscriptions} />
            </div>

            {/* Intelligence */}
            <SavingsPanel insights={insights} totalSavings={totalSavings} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
