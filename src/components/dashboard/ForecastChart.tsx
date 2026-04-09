import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { formatCurrency, formatCurrencyRaw, convertFromEUR } from "@/lib/currency";
import type { Subscription } from "@/hooks/useSubscriptions";

interface ForecastChartProps {
  subscriptions: Subscription[];
}

const ForecastChart = ({ subscriptions }: ForecastChartProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const active = subscriptions.filter((s) => s.status === "active");
  const monthlyBase = active.reduce(
    (sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12),
    0
  );

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const data = [];
  let cumulative = 0;

  for (let i = 0; i < 12; i++) {
    const monthIdx = (now.getMonth() + i) % 12;
    const yearlyThisMonth = active
      .filter((s) => s.billing_cycle === "yearly" && new Date(s.next_billing_date).getMonth() === monthIdx)
      .reduce((sum, s) => sum + s.price, 0);

    const totalEUR = monthlyBase + yearlyThisMonth;
    cumulative += totalEUR;

    data.push({
      month: months[monthIdx],
      spending: Math.round(convertFromEUR(totalEUR, lang)),
      cumulative: Math.round(convertFromEUR(cumulative, lang)),
    });
  }

  const chartConfig = {
    spending: { label: t("monthly"), color: "hsl(var(--primary))" },
    cumulative: { label: "Cumulative", color: "hsl(252, 85%, 75%)" },
  };

  const symbol = formatCurrency(0, lang).replace(/[\d.,\s]/g, "").trim();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">{t("spendingForecast")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${symbol}${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="spending" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSpending)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {t("projectedYearly")}: <strong className="text-foreground">{formatCurrencyRaw(data[data.length - 1]?.cumulative ?? 0, lang)}</strong>
        </p>
      </CardContent>
    </Card>
  );
};

export default ForecastChart;
