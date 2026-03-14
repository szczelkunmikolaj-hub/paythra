import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";

interface OverloadIndexCardProps {
  activeCount: number;
}

const OverloadIndexCard = ({ activeCount }: OverloadIndexCardProps) => {
  const recommended = 8;
  const index = activeCount / recommended;
  const isOverloaded = index > 1;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Gauge className="h-4 w-4" />
          Overload Index
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${isOverloaded ? "text-destructive" : "text-green-500"}`}>
            {index.toFixed(2)}x
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCount} / {recommended} recommended
        </p>
        {isOverloaded && (
          <p className="mt-2 text-xs text-destructive">
            You have more subscriptions than recommended. Consider consolidating.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OverloadIndexCard;
