import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import type { Subscription } from "@/hooks/useSubscriptions";
import SubscriptionIcon from "./SubscriptionIcon";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

const SubscriptionCard = ({ subscription: sub, onEdit, onDelete }: SubscriptionCardProps) => {
  const daysUntilBilling = Math.ceil(
    (new Date(sub.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="group shadow-card transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5 overflow-hidden">
      <CardContent className="flex items-center gap-4 p-4">
        <SubscriptionIcon name={sub.name} category={sub.category} size="lg" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{sub.name}</h3>
            {sub.is_trial && (
              <Badge variant="outline" className="border-primary text-primary text-[10px]">Trial</Badge>
            )}
            {sub.is_unused && (
              <Badge variant="destructive" className="text-[10px]">Unused</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize text-xs">{sub.category}</span>
            <span>•</span>
            <span>
              Next: {daysUntilBilling <= 0
                ? "Due today"
                : new Date(sub.next_billing_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-foreground">€{sub.price.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">/{sub.billing_cycle === "monthly" ? "mo" : "yr"}</div>
        </div>

        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
