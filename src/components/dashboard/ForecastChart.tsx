import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import type { Subscription } from "@/hooks/useSubscriptions";

interface ForecastChartProps {
  subscriptions: Subscription[];
}

const ForecastChart = ({ subscriptions }: ForecastChartProps) => {
  const active = subscriptions.filter((s) => s.status === "active");
  const monthlyBase = active.reduce(
    (sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12),
    0
  );

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const now = new Date();
  const data = [];
  let cumulative = 0;

  for (let i = 0; i < 12; i++) {
    const monthIdx = (now.getMonth() + i) % 12;
    // Check for yearly subs in this month
    const yearlyThisMonth = active
      .filter((s) => {
        if (s.billing_cycle !== "yearly") return false;
        const next = new Date(s.next_billing_date);
        return next.getMonth() === monthIdx;
      })
      .reduce((sum, s) => sum + s.price, 0);

    cumulative += monthlyBase + yearlyThisMonth;

    data.push({
      month: months[monthIdx],
      spending: Math.round(monthlyBase + yearlyThisMonth),
      cumulative: Math.round(cumulative),
    });
  }

  const chartConfig = {
    spending: { label: "Monthly", color: "hsl(var(--primary))" },
    cumulative: { label: "Cumulative", color: "hsl(252, 85%, 75%)" },
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">12-Month Spending Forecast</CardTitle>
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
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `€${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorSpending)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Projected yearly: <strong className="text-foreground">€{data[data.length - 1]?.cumulative ?? 0}</strong>
        </p>
      </CardContent>
    </Card>
  );
};

export default ForecastChart;
