import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import type { DetectedSubscription } from "@/hooks/useTransactions";
import { findService } from "@/lib/serviceRegistry";

interface DetectedSubscriptionsProps {
  detected: DetectedSubscription[];
  onConfirm: (d: DetectedSubscription) => void;
  onDismiss: (merchant: string) => void;
}

const DetectedSubscriptions = ({ detected, onConfirm, onDismiss }: DetectedSubscriptionsProps) => {
  if (detected.length === 0) return null;

  return (
    <Card className="border-primary/20 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Sparkles className="h-4 w-4 text-primary" />
          Detected Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {detected.map((d) => {
          const service = findService(d.merchant);
          return (
            <div key={d.merchant} className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
              {service?.logo ? (
                <img src={service.logo} alt={d.merchant} className="h-8 w-8 rounded object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {service?.name ?? d.merchant} — €{d.amount.toFixed(2)}/{d.cycle === "monthly" ? "mo" : "yr"}
                </p>
                <p className="text-xs text-muted-foreground">{d.occurrences} matching transactions found</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" onClick={() => onConfirm(d)}>
                  <Check className="mr-1 h-3.5 w-3.5" /> Add
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-muted-foreground" onClick={() => onDismiss(d.merchant)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DetectedSubscriptions;
