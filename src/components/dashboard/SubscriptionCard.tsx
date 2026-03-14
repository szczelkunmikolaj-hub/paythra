import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, CreditCard } from "lucide-react";
import type { Subscription } from "@/hooks/useSubscriptions";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  streaming: "bg-primary/10 text-primary",
  gaming: "bg-accent text-accent-foreground",
  software: "bg-secondary text-secondary-foreground",
  productivity: "bg-muted text-muted-foreground",
  other: "bg-muted text-muted-foreground",
};

const SubscriptionCard = ({ subscription: sub, onEdit, onDelete }: SubscriptionCardProps) => {
  const daysUntilBilling = Math.ceil(
    (new Date(sub.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="shadow-card transition-shadow hover:shadow-elevated">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-primary">
          {sub.logo_url ? (
            <img src={sub.logo_url} alt={sub.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
          ) : null}
          <CreditCard className={`h-5 w-5 text-primary-foreground ${sub.logo_url ? 'hidden' : ''}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{sub.name}</h3>
            {sub.is_trial && (
              <Badge variant="outline" className="border-primary text-primary text-[10px]">
                Trial
              </Badge>
            )}
            {sub.is_unused && (
              <Badge variant="destructive" className="text-[10px]">
                Unused
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[sub.category] ?? categoryColors.other}`}>
              {sub.category}
            </span>
            <span>•</span>
            <span>{sub.billing_cycle}</span>
            <span>•</span>
            <span>
              {daysUntilBilling <= 0 ? "Due today" : `in ${daysUntilBilling}d`}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-foreground">€{sub.price.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">/{sub.billing_cycle === "monthly" ? "mo" : "yr"}</div>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(sub)}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(sub.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
