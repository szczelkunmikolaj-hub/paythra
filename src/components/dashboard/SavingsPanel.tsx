import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, AlertTriangle, GraduationCap, Users, Eye } from "lucide-react";
import type { Insight } from "@/hooks/useSubscriptionIntelligence";

const iconMap = {
  alert: AlertTriangle,
  savings: PiggyBank,
  student: GraduationCap,
  family: Users,
  unused: Eye,
};

interface SavingsPanelProps {
  insights: Insight[];
  totalSavings: number;
}

const SavingsPanel = ({ insights, totalSavings }: SavingsPanelProps) => {
  if (insights.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <PiggyBank className="h-5 w-5 text-primary" />
            Savings Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No savings opportunities detected. Your subscriptions look optimized!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-display text-lg">
          <span className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            Savings Opportunities
          </span>
          {totalSavings > 0 && (
            <span className="text-sm font-medium text-green-600">
              Save up to €{totalSavings.toFixed(0)}/year
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.slice(0, 8).map((insight) => {
          const Icon = iconMap[insight.icon];
          return (
            <div
              key={insight.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
            >
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{insight.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{insight.message}</p>
              </div>
              {insight.savingsPerYear > 0 && (
                <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  -€{insight.savingsPerYear.toFixed(0)}/yr
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SavingsPanel;
