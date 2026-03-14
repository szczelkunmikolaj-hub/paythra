import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface HealthScoreCardProps {
  score: number;
  monthlySpend: number;
  monthlyIncome: number | null;
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

const HealthScoreCard = ({ score, monthlySpend, monthlyIncome }: HealthScoreCardProps) => {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const percentage = monthlyIncome ? ((monthlySpend / monthlyIncome) * 100).toFixed(1) : null;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Heart className="h-4 w-4" />
          Subscription Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${color}`}>{score}</span>
          <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
        </div>
        <p className={`mt-1 text-sm font-medium ${color}`}>{label}</p>
        {percentage && (
          <p className="mt-2 text-xs text-muted-foreground">
            Subscriptions use {percentage}% of your income
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard;
