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

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Healthy";
  if (score >= 50) return "Needs Attention";
  return "At Risk";
};

const getProgressColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-destructive";
};

const HealthScoreCard = ({ score, monthlySpend, monthlyIncome, activeCount = 0, unusedCount = 0 }: HealthScoreCardProps) => {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const percentage = monthlyIncome ? ((monthlySpend / monthlyIncome) * 100) : null;

  const factors: string[] = [];
  if (percentage !== null) {
    factors.push(
      percentage > 10
        ? `⚠ You spend ${percentage.toFixed(1)}% of your income on subscriptions. Recommended: under 10%.`
        : `✓ Subscription spending is ${percentage.toFixed(1)}% of income (under 10%).`
    );
  }
  if (activeCount > 10) factors.push(`⚠ You have ${activeCount} active subscriptions (recommended: ≤10).`);
  else factors.push(`✓ ${activeCount} active subscriptions (within recommended limit).`);
  if (unusedCount > 0) factors.push(`⚠ ${unusedCount} unused subscription${unusedCount > 1 ? "s" : ""} detected.`);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Heart className="h-4 w-4" />
          Subscription Health
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/60" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">Based on income ratio, subscription count, and unused service detection.</p>
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

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${getProgressColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Score breakdown */}
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
