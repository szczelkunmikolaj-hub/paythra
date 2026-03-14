import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { Subscription } from "@/hooks/useSubscriptions";

interface TrialCountdownProps {
  subscriptions: Subscription[];
}

const TrialCountdown = ({ subscriptions }: TrialCountdownProps) => {
  const trials = subscriptions.filter(
    (s) => s.is_trial && s.trial_end_date && s.status === "active"
  );

  if (trials.length === 0) return null;

  return (
    <div className="space-y-2">
      {trials.map((trial) => {
        const end = new Date(trial.trial_end_date!);
        const now = new Date();
        const totalDays = Math.ceil(
          (end.getTime() - new Date(trial.start_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const progress = totalDays > 0 ? Math.max(0, Math.min(100, ((totalDays - daysLeft) / totalDays) * 100)) : 100;
        const isUrgent = daysLeft <= 3;

        return (
          <Card key={trial.id} className={`shadow-card ${isUrgent ? "border-destructive/40" : ""}`}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg p-2 ${isUrgent ? "bg-destructive/10" : "bg-primary/10"}`}>
                <Clock className={`h-4 w-4 ${isUrgent ? "text-destructive" : "text-primary"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{trial.name}</p>
                  <span className={`text-xs font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                    {daysLeft === 0 ? "Expired" : `${daysLeft}d left`}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${isUrgent ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TrialCountdown;
