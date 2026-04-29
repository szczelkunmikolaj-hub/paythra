import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUserPlan, PlanType, PLAN_LIMITS } from "@/hooks/useUserPlan";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Star, Zap, Building2, Tag, ShieldCheck, FlaskConical, PartyPopper } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface PlanSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PlanSelectionModal = ({ open, onOpenChange }: PlanSelectionModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    plan: currentPlan,
    upgradePlan,
    isUpgrading,
    hasValidDiscount,
    applyDiscountCode,
    isTestMode,
    activateTestMode,
    deactivateTestMode,
  } = useUserPlan();
  const [discountInput, setDiscountInput] = useState("");
  const [applyingCode, setApplyingCode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleTestModeToggle = async (enabled: boolean) => {
    if (enabled) {
      await activateTestMode();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast({ title: t("testModeActivated"), description: t("testModeDesc") });
    } else {
      await deactivateTestMode();
      toast({ title: t("testModeDeactivated") });
    }
  };

  const handleSelect = async (plan: PlanType) => {
    if (!user) {
      navigate("/signup");
      onOpenChange(false);
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
    if (!user) { navigate("/signup"); onOpenChange(false); return; }
    const trimmed = discountInput.trim();
    if (!trimmed) return;
    setApplyingCode(true);
    try {
      const valid = await applyDiscountCode(trimmed);
      if (valid) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
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

  const plans = [
    { id: "free" as PlanType, icon: Zap, name: t("planFree"), price: "€0", priceNote: t("planMonth"), features: [t("planFreeF1"), t("planFreeF2"), t("planFreeF3")] },
    { id: "premium" as PlanType, icon: Star, name: "Premium", price: "€24.99", priceNote: "one-time", popular: true, features: [t("planPremiumF1"), t("planPremiumF2"), t("planPremiumF3"), t("planPremiumF4"), t("planPremiumF5")] },
    { id: "business" as PlanType, icon: Building2, name: "Business", price: "Custom", priceNote: "contact us", features: [t("planBusinessF1"), t("planBusinessF2"), t("planBusinessF3"), t("planBusinessF4"), t("planBusinessF5"), t("planBusinessF6")] },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">{t("pricingTitle")}</DialogTitle>
          <DialogDescription className="text-center">{t("pricingSubtitle")}</DialogDescription>
        </DialogHeader>

        {/* Confetti animation */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center space-y-2">
                <PartyPopper className="h-16 w-16 text-primary mx-auto animate-bounce" />
                <p className="text-lg font-bold text-primary">{t("premiumActivated")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Mode & Status Banners */}
        <div className="space-y-3">
          {/* Test Mode Toggle */}
          {!hasValidDiscount && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4">
              <div className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{t("testMode")}</p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70">{t("testModeHint")}</p>
                </div>
              </div>
              <Switch checked={isTestMode} onCheckedChange={handleTestModeToggle} />
            </div>
          )}

          {/* Active status */}
          {(isTestMode || hasValidDiscount) && (
            <div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-4">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {hasValidDiscount ? t("fullAccessActive") : t("testModeActive")}
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">
                  {hasValidDiscount ? `Business · €0/${t("planMonth")}` : `Premium · ${t("testMode")}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.id;
            const isOverridden = hasValidDiscount && p.id === "business";
            const isTestPremium = isTestMode && !hasValidDiscount && p.id === "premium";
            return (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-xl border p-4 transition-all ${
                  p.popular && !hasValidDiscount ? "border-primary ring-2 ring-primary/20" : ""
                } ${isOverridden ? "border-green-400 ring-2 ring-green-300/30" : ""} ${
                  isTestPremium ? "border-amber-400 ring-2 ring-amber-300/30" : ""
                }`}
              >
                {p.popular && !hasValidDiscount && !isTestMode && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs">
                    {t("mostPopular")}
                  </Badge>
                )}
                {isTestPremium && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs">
                    {t("testMode")}
                  </Badge>
                )}
                <div className="text-center mb-3">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-display font-bold">{p.name}</p>
                  <p className="text-2xl font-extrabold text-foreground mt-1">
                    {isOverridden ? <><span className="text-green-600">€0</span><span className="ml-1 text-sm text-muted-foreground line-through">{p.price}</span></> : p.price}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">{p.priceNote}</span>
                  </p>
                </div>
                <ul className="space-y-2 flex-1 mb-3">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  className={`w-full ${p.popular && !hasValidDiscount ? "bg-gradient-primary hover:opacity-90" : ""}`}
                  variant={p.popular && !hasValidDiscount ? "default" : "outline"}
                  disabled={isCurrent || isUpgrading || hasValidDiscount || isTestMode}
                  onClick={() => handleSelect(p.id)}
                >
                  {isCurrent ? t("currentPlan") : t("selectPlan")}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Discount Code */}
        {!hasValidDiscount && !isTestMode && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder={t("enterDiscountCode")}
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
              maxLength={30}
              className="flex-1"
            />
            <Button size="sm" onClick={handleApplyCode} disabled={applyingCode || !discountInput.trim()}>
              {applyingCode ? t("sending") : t("applyCode")}
            </Button>
          </div>
        )}

        <div className="text-center">
          <button onClick={() => { onOpenChange(false); navigate("/pricing"); }} className="text-xs text-muted-foreground hover:text-primary underline">
            {t("viewFullPricing")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSelectionModal;
