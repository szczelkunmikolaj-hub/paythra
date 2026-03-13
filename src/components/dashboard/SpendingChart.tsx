import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Subscription } from "@/hooks/useSubscriptions";

const SpendingChart = ({ subscriptions }: { subscriptions: Subscription[] }) => {
  const active = subscriptions.filter((s) => s.status === "active");

  // Generate last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { month: d.toLocaleString("default", { month: "short" }), total: 0 };
  });

  // Simple: distribute current monthly cost across months
  const monthlyTotal = active.reduce((sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12), 0);
  months.forEach((m) => (m.total = Math.round(monthlyTotal * 100) / 100));

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        {active.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Add subscriptions to see spending data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
