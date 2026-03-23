import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan, PlanType } from "@/hooks/useUserPlan";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Pricing = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { plan: currentPlan, upgradePlan, isUpgrading } = useUserPlan();

  const handleSelect = async (plan: PlanType) => {
    if (!user) {
      navigate("/signup");
      return;
    }
    if (plan === currentPlan) return;
    try {
      await upgradePlan(plan);
      toast({ title: t("planUpdated"), description: t("planUpdatedDesc") });
    } catch {
      toast({ title: t("error"), variant: "destructive" });
    }
  };

  const plans = [
    {
      id: "free" as PlanType,
      icon: Zap,
      name: t("planFree"),
      price: "€0",
      period: `/${t("planMonth")}`,
      features: [
        t("planFreeF1"),
        t("planFreeF2"),
        t("planFreeF3"),
      ],
    },
    {
      id: "premium" as PlanType,
      icon: Star,
      name: "Premium",
      price: "€2.99",
      period: `/${t("planMonth")}`,
      popular: true,
      features: [
        t("planPremiumF1"),
        t("planPremiumF2"),
        t("planPremiumF3"),
        t("planPremiumF4"),
        t("planPremiumF5"),
      ],
    },
    {
      id: "business" as PlanType,
      icon: Building2,
      name: "Business",
      price: "€29.99",
      period: `/${t("planMonth")}`,
      features: [
        t("planBusinessF1"),
        t("planBusinessF2"),
        t("planBusinessF3"),
        t("planBusinessF4"),
        t("planBusinessF5"),
        t("planBusinessF6"),
      ],
    },
  ];

  const content = (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">{t("pricingTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("pricingSubtitle")}</p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.id;
          return (
            <Card
              key={p.id}
              className={`relative flex flex-col shadow-card transition-all hover:shadow-elevated ${
                p.popular ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              {p.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white">
                  {t("mostPopular")}
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-xl">{p.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <ul className="space-y-3">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${p.popular ? "bg-gradient-primary hover:opacity-90" : ""}`}
                  variant={p.popular ? "default" : "outline"}
                  disabled={isCurrent || isUpgrading}
                  onClick={() => handleSelect(p.id)}
                >
                  {isCurrent ? t("currentPlan") : t("selectPlan")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return user ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    <div className="min-h-screen bg-background px-4 py-20">{content}</div>
  );
};

export default Pricing;
