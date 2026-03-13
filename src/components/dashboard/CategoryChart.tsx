import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Subscription } from "@/hooks/useSubscriptions";

const COLORS = [
  "hsl(252, 85%, 60%)",
  "hsl(270, 95%, 65%)",
  "hsl(200, 80%, 55%)",
  "hsl(150, 60%, 50%)",
  "hsl(30, 80%, 55%)",
];

const CATEGORIES = ["streaming", "gaming", "software", "productivity", "other"];

const CategoryChart = ({ subscriptions }: { subscriptions: Subscription[] }) => {
  const active = subscriptions.filter((s) => s.status === "active");

  const data = CATEGORIES.map((cat) => {
    const total = active
      .filter((s) => s.category === cat)
      .reduce((sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12), 0);
    return { name: cat.charAt(0).toUpperCase() + cat.slice(1), value: Math.round(total * 100) / 100 };
  }).filter((d) => d.value > 0);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">By Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No category data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }) => name}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
