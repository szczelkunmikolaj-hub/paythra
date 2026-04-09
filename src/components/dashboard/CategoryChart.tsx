import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, convertFromEUR } from "@/lib/currency";
import type { Subscription } from "@/hooks/useSubscriptions";
import { getServiceColor } from "@/lib/serviceRegistry";

const FALLBACK_COLORS = [
  "hsl(252, 85%, 60%)", "hsl(270, 95%, 65%)", "hsl(200, 80%, 55%)",
  "hsl(150, 60%, 50%)", "hsl(30, 80%, 55%)", "hsl(340, 75%, 55%)",
  "hsl(180, 60%, 45%)", "hsl(60, 70%, 50%)",
];

const CategoryChart = ({ subscriptions }: { subscriptions: Subscription[] }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const active = subscriptions.filter((s) => s.status === "active");

  const serviceData = active.map((s) => ({
    name: s.name,
    value: Math.round(convertFromEUR(s.billing_cycle === "monthly" ? s.price : s.price / 12, lang) * 100) / 100,
    color: getServiceColor(s.name),
  }));

  const totalMonthly = serviceData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">{t("spendingByService")}</CardTitle>
      </CardHeader>
      <CardContent>
        {serviceData.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">{t("noSubDataYet")}</div>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={serviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={2} stroke="hsl(var(--background))">
                  {serviceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value, lang)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5 overflow-hidden">
              {serviceData.slice(0, 6).map((d, i) => {
                const pct = totalMonthly > 0 ? ((d.value / totalMonthly) * 100).toFixed(0) : "0";
                return (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length] }} />
                    <span className="text-xs text-foreground truncate flex-1">{d.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{pct}%</span>
                  </div>
                );
              })}
              {serviceData.length > 6 && <p className="text-xs text-muted-foreground">+{serviceData.length - 6} more</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
