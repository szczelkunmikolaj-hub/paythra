import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from "lucide-react";

const Analytics = () => {
  const { subscriptions, isLoading } = useSubscriptions();

  const active = subscriptions.filter((s) => s.status === "active");
  const monthlyTotal = active.reduce((sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12), 0);
  const yearlyProjected = monthlyTotal * 12;
  const unused = active.filter((s) => s.is_unused);
  const duplicateCategories = new Map<string, number>();
  active.forEach((s) => duplicateCategories.set(s.category, (duplicateCategories.get(s.category) || 0) + 1));

  const insights: string[] = [];
  if (yearlyProjected > 700) insights.push(`Your yearly subscription cost (€${yearlyProjected.toFixed(0)}) is above the European average of €700.`);
  unused.forEach((s) => insights.push(`You marked ${s.name} as unused. Consider cancelling to save €${s.billing_cycle === "monthly" ? (s.price * 12).toFixed(0) : s.price.toFixed(0)}/year.`));
  duplicateCategories.forEach((count, cat) => {
    if (count >= 2) insights.push(`You have ${count} ${cat} subscriptions. Consider consolidating.`);
  });
  if (insights.length === 0 && active.length > 0) insights.push("Your subscription spending looks optimized!");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics & Insights</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <Card className="border-primary/20 shadow-card">
              <CardContent className="flex items-center gap-4 p-6">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Projected yearly spending</p>
                  <p className="text-3xl font-bold text-foreground">€{yearlyProjected.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <SpendingChart subscriptions={subscriptions} />
              <CategoryChart subscriptions={subscriptions} />
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Optimization Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-3 text-sm text-foreground">
                    {insight}
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
