import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import type { Subscription } from "@/hooks/useSubscriptions";

interface StatsCardsProps {
  subscriptions: Subscription[];
}

const StatsCards = ({ subscriptions }: StatsCardsProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const active = subscriptions.filter((s) => s.status === "active");
  const monthly = active.reduce((sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12), 0);
  const yearly = monthly * 12;
  const unused = active.filter((s) => s.is_unused).length;

  const stats = [
    { title: t("monthlyCost"), value: formatCurrency(monthly, lang), icon: CreditCard, color: "text-primary" },
    { title: t("yearlyCost"), value: formatCurrency(yearly, lang), icon: TrendingUp, color: "text-accent-foreground" },
    { title: t("activeSubscriptions"), value: active.length.toString(), icon: Zap, color: "text-primary" },
    { title: t("unusedAlerts"), value: unused.toString(), icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
