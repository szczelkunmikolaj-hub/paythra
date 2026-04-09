import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HealthScoreCardProps {
  score: number;
  monthlySpend: number;
  monthlyIncome: number | null;
  activeCount?: number;
  unusedCount?: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-destructive";
};

const getProgressColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-destructive";
};

const HealthScoreCard = ({ score, monthlySpend, monthlyIncome, activeCount = 0, unusedCount = 0 }: HealthScoreCardProps) => {
  const { t } = useTranslation();
  const color = getScoreColor(score);
  const percentage = monthlyIncome ? ((monthlySpend / monthlyIncome) * 100) : null;

  const label = score >= 80 ? t("healthy") : score >= 50 ? t("needsAttention") : t("atRisk");

  const factors: string[] = [];
  if (percentage !== null) {
    factors.push(
      percentage > 10
        ? t("healthSpendWarning", { pct: percentage.toFixed(1) })
        : t("healthSpendOk", { pct: percentage.toFixed(1) })
    );
  }
  if (activeCount > 10) factors.push(t("healthSubsWarning", { count: activeCount }));
  else factors.push(t("healthSubsOk", { count: activeCount }));
  if (unusedCount > 0) factors.push(t("healthUnusedWarning", { count: unusedCount }));

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Heart className="h-4 w-4" />
          {t("subscriptionHealth")}
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/60" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{t("healthTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${color}`}>{score}</span>
          <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
        </div>
        <p className={`text-sm font-medium ${color}`}>{label}</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all ${getProgressColor(score)}`} style={{ width: `${score}%` }} />
        </div>
        <div className="space-y-1 pt-1">
          {factors.map((f, i) => (
            <p key={i} className="text-xs text-muted-foreground">{f}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard;
