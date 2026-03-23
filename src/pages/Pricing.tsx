import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan, PlanType } from "@/hooks/useUserPlan";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Star, Zap, Building2, Tag, X, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Pricing = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    plan: currentPlan,
    upgradePlan,
    isUpgrading,
    hasValidDiscount,
    applyDiscountCode,
    removeDiscountCode,
  } = useUserPlan();
  const [discountInput, setDiscountInput] = useState("");
  const [applyingCode, setApplyingCode] = useState(false);

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

  const handleApplyCode = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    const trimmed = discountInput.trim();
    if (!trimmed) return;
    setApplyingCode(true);
    try {
      const valid = await applyDiscountCode(trimmed);
      if (valid) {
        toast({ title: t("discountApplied"), description: t("fullAccessActive") });
        setDiscountInput("");
      } else {
        toast({ title: t("invalidCode"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("error"), variant: "destructive" });
    } finally {
      setApplyingCode(false);
    }
  };

  const handleRemoveCode = async () => {
    try {
      await removeDiscountCode();
      toast({ title: t("discountRemoved") });
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
      features: [t("planFreeF1"), t("planFreeF2"), t("planFreeF3")],
    },
    {
      id: "premium" as PlanType,
      icon: Star,
      name: "Premium",
      price: "€2.99",
      period: `/${t("planMonth")}`,
      popular: true,
      features: [t("planPremiumF1"), t("planPremiumF2"), t("planPremiumF3"), t("planPremiumF4"), t("planPremiumF5")],
    },
    {
      id: "business" as PlanType,
      icon: Building2,
      name: "Business",
      price: "€29.99",
      period: `/${t("planMonth")}`,
      features: [t("planBusinessF1"), t("planBusinessF2"), t("planBusinessF3"), t("planBusinessF4"), t("planBusinessF5"), t("planBusinessF6")],
    },
  ];

  const content = (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">{t("pricingTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("pricingSubtitle")}</p>
      </div>

      {/* Discount Code Status */}
      {hasValidDiscount && (
        <div className="mx-auto max-w-md">
          <Card className="border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">{t("fullAccessActive")}</p>
                  <p className="text-xs text-green-600/70 dark:text-green-400/70">Business · €0/{t("planMonth")}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveCode} className="text-green-700 hover:text-destructive dark:text-green-300">
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan Cards */}
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.id;
          const isOverridden = hasValidDiscount && p.id === "business";
          return (
            <Card
              key={p.id}
              className={`relative flex flex-col shadow-card transition-all hover:shadow-elevated ${
                p.popular && !hasValidDiscount ? "border-primary ring-2 ring-primary/20" : ""
              } ${isOverridden ? "border-green-400 ring-2 ring-green-300/30" : ""}`}
            >
              {p.popular && !hasValidDiscount && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white">
                  {t("mostPopular")}
                </Badge>
              )}
              {isOverridden && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white">
                  {t("fullAccessActive")}
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-xl">{p.name}</CardTitle>
                <div className="mt-2">
                  {isOverridden ? (
                    <>
                      <span className="text-4xl font-extrabold text-green-600 dark:text-green-400">€0</span>
                      <span className="ml-1 text-sm text-muted-foreground line-through">{p.price}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-foreground">{p.price}</span>
                  )}
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
                  className={`w-full ${p.popular && !hasValidDiscount ? "bg-gradient-primary hover:opacity-90" : ""}`}
                  variant={p.popular && !hasValidDiscount ? "default" : "outline"}
                  disabled={isCurrent || isUpgrading || hasValidDiscount}
                  onClick={() => handleSelect(p.id)}
                >
                  {isCurrent ? t("currentPlan") : t("selectPlan")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Discount Code Input */}
      {!hasValidDiscount && (
        <div className="mx-auto max-w-md">
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t("haveDiscountCode")}</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("enterDiscountCode")}
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                  maxLength={30}
                />
                <Button onClick={handleApplyCode} disabled={applyingCode || !discountInput.trim()}>
                  {applyingCode ? t("sending") : t("applyCode")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  return user ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    <div className="min-h-screen bg-background px-4 py-20">{content}</div>
  );
};

export default Pricing;
