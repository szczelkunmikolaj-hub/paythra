import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface UpgradePromptProps {
  feature: string;
  requiredPlan: "premium" | "business";
}

const UpgradePrompt = ({ feature, requiredPlan }: UpgradePromptProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <Lock className="h-8 w-8 text-primary/60" />
        <p className="text-sm font-medium text-foreground">{feature}</p>
        <p className="text-xs text-muted-foreground">
          {t("upgradeRequired", { plan: requiredPlan === "premium" ? "Premium" : "Business" })}
        </p>
        <Button
          size="sm"
          className="bg-gradient-primary hover:opacity-90"
          onClick={() => navigate("/pricing")}
        >
          {t("upgradeNow")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
