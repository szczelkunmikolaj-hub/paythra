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
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Target, Lightbulb } from "lucide-react";

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
              <Card className="border-primary/20 shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Projected Yearly</p>
                    <p className="text-2xl font-bold text-foreground">€{yearlyProjected.toFixed(0)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Spend</p>
                    <p className="text-2xl font-bold text-foreground">€{monthlySpend.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Subs</p>
                    <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                  </div>
                </CardContent>
              </Card>
              {totalSavings > 0 && (
                <Card className="border-green-200 shadow-card dark:border-green-800/30">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                      <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Potential Savings</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">€{totalSavings.toFixed(0)}/yr</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

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
