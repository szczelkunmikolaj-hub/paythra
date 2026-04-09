import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useProfile } from "@/hooks/useProfile";
import { useSubscriptionIntelligence } from "@/hooks/useSubscriptionIntelligence";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  PiggyBank, Lightbulb, Clock, TrendingDown, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, Eye, GraduationCap, Users, Info, Sparkles,
} from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" } }),
};

const Suggestions = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { subscriptions, isLoading } = useSubscriptions();
  const { services } = useServicePricing();
  const { profile } = useProfile();

  const { insights, totalSavings, monthlySpend } = useSubscriptionIntelligence({
    subscriptions,
    services,
    isStudent: profile?.is_student ?? false,
    monthlyIncome: profile?.monthly_income ?? null,
  });

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [savingsOpen, setSavingsOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);
  const [timeOpen, setTimeOpen] = useState(true);

  const active = useMemo(() => subscriptions.filter((s) => s.status === "active"), [subscriptions]);

  // ─── Possible Savings (green) ───
  const savingsInsights = useMemo(
    () => insights.filter((i) => i.savingsPerYear > 0 && !dismissedIds.has(i.id)),
    [insights, dismissedIds]
  );

  // ─── AI Suggestions (blue/orange) ───
  const aiSuggestions = useMemo(() => {
    const suggestions: { id: string; title: string; message: string; icon: "lightbulb" | "alert" | "pause"; value?: number }[] = [];

    // Streaming bundle suggestion
    const streamingSubs = active.filter((s) => s.category.toLowerCase() === "streaming");
    if (streamingSubs.length >= 2) {
      const totalMonthly = streamingSubs.reduce((sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12), 0);
      suggestions.push({
        id: "ai-streaming-bundle",
        title: t("suggestionsAIStreamingTitle"),
        message: t("suggestionsAIStreamingMsg", {
          count: streamingSubs.length,
          total: formatCurrency(totalMonthly, lang),
        }),
        icon: "alert",
        value: totalMonthly,
      });
    }

    // Pause suggestion for most expensive
    if (active.length > 0) {
      const sorted = [...active].sort((a, b) => {
        const am = a.billing_cycle === "monthly" ? a.price : a.price / 12;
        const bm = b.billing_cycle === "monthly" ? b.price : b.price / 12;
        return bm - am;
      });
      const top = sorted[0];
      const topMonthly = top.billing_cycle === "monthly" ? top.price : top.price / 12;
      suggestions.push({
        id: "ai-pause-top",
        title: t("suggestionsAIPauseTitle"),
        message: t("suggestionsAIPauseMsg", { name: top.name, amount: formatCurrency(topMonthly, lang) }),
        icon: "pause",
        value: topMonthly,
      });
    }

    // Unused subscription prompts
    active
      .filter((s) => s.is_unused)
      .forEach((s) => {
        suggestions.push({
          id: `ai-unused-${s.id}`,
          title: t("suggestionsAIUnusedTitle"),
          message: t("suggestionsAIUnusedMsg", { name: s.name }),
          icon: "lightbulb",
        });
      });

    // Category consolidation
    const catMap = new Map<string, number>();
    active.forEach((s) => {
      catMap.set(s.category, (catMap.get(s.category) || 0) + 1);
    });
    catMap.forEach((count, cat) => {
      if (count >= 3) {
        suggestions.push({
          id: `ai-consolidate-${cat}`,
          title: t("suggestionsAIConsolidateTitle"),
          message: t("suggestionsAIConsolidateMsg", { count, category: t(cat.toLowerCase()) || cat }),
          icon: "alert",
        });
      }
    });

    return suggestions.filter((s) => !dismissedIds.has(s.id));
  }, [active, dismissedIds, t, lang]);

  // ─── Time Machine ───
  const timeMachine = useMemo(() => {
    const items: { id: string; title: string; message: string; amount: number }[] = [];

    // Past: unused subs – if canceled 6 months ago
    active
      .filter((s) => s.is_unused)
      .forEach((s) => {
        const monthly = s.billing_cycle === "monthly" ? s.price : s.price / 12;
        const saved6mo = monthly * 6;
        items.push({
          id: `tm-past-${s.id}`,
          title: t("suggestionsTimePastTitle"),
          message: t("suggestionsTimePastMsg", { name: s.name, amount: formatCurrency(saved6mo, lang) }),
          amount: saved6mo,
        });
      });

    // Future: projected 12-month savings from all insights
    if (totalSavings > 0) {
      items.push({
        id: "tm-future-total",
        title: t("suggestionsTimeFutureTitle"),
        message: t("suggestionsTimeFutureMsg", { amount: formatCurrency(totalSavings, lang) }),
        amount: totalSavings,
      });
    }

    // Overlapping streaming projected
    const streamingSubs = active.filter((s) => s.category.toLowerCase() === "streaming");
    if (streamingSubs.length >= 2) {
      const cheapest = Math.min(...streamingSubs.map((s) => (s.billing_cycle === "monthly" ? s.price : s.price / 12)));
      const projectedSave = streamingSubs
        .filter((s) => {
          const m = s.billing_cycle === "monthly" ? s.price : s.price / 12;
          return m !== cheapest;
        })
        .reduce((sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12) * 12, 0);
      if (projectedSave > 0) {
        items.push({
          id: "tm-streaming-overlap",
          title: t("suggestionsTimeOverlapTitle"),
          message: t("suggestionsTimeOverlapMsg", { amount: formatCurrency(projectedSave, lang) }),
          amount: projectedSave,
        });
      }
    }

    return items.filter((i) => !dismissedIds.has(i.id));
  }, [active, totalSavings, dismissedIds, t, lang]);

  const totalActionable = savingsInsights.length + aiSuggestions.length + timeMachine.length;

  const dismiss = (id: string) => setDismissedIds((prev) => new Set(prev).add(id));

  const iconForInsight = (icon: string) => {
    switch (icon) {
      case "alert": return AlertTriangle;
      case "student": return GraduationCap;
      case "family": return Users;
      case "unused": return Eye;
      default: return PiggyBank;
    }
  };

  const aiIconMap = { lightbulb: Lightbulb, alert: AlertTriangle, pause: Clock };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Hero summary */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-primary-foreground shadow-glow"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left space-y-1">
              <h1 className="font-display text-3xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <Sparkles className="h-7 w-7" /> {t("suggestionsTitle")}
              </h1>
              <p className="text-primary-foreground/70 text-sm">{t("suggestionsSubtitle")}</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalSavings, lang)}</p>
                <p className="text-xs text-primary-foreground/60">{t("suggestionsTotalSavings")}</p>
              </div>
              <div className="border-l border-primary-foreground/20 pl-6">
                <p className="text-2xl font-bold">{totalActionable}</p>
                <p className="text-xs text-primary-foreground/60">{t("suggestionsActionable")}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Possible Savings ═══ */}
        <Collapsible open={savingsOpen} onOpenChange={setSavingsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-lg bg-green-50 dark:bg-green-950/30 px-4 py-3 text-left">
              <span className="flex items-center gap-2 font-display text-lg font-semibold text-green-700 dark:text-green-400">
                <PiggyBank className="h-5 w-5" /> {t("suggestionsSavingsSection")}
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                  {savingsInsights.length}
                </Badge>
              </span>
              {savingsOpen ? <ChevronUp className="h-4 w-4 text-green-600" /> : <ChevronDown className="h-4 w-4 text-green-600" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            {savingsInsights.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">{t("noSavingsDetected")}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <AnimatePresence>
                  {savingsInsights.map((insight, i) => {
                    const Icon = iconForInsight(insight.icon);
                    return (
                      <motion.div key={insight.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" exit="hidden" layout>
                        <Card className="border-green-200 dark:border-green-800/40 shadow-sm hover:shadow-md transition-shadow group">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-lg bg-green-100 dark:bg-green-900/40 p-2 shrink-0">
                                <Icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs text-xs">{insight.message}</TooltipContent>
                                  </Tooltip>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{insight.message}</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    -{formatCurrency(insight.savingsPerYear, lang)}/{t("perYear").replace("/", "")}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => dismiss(insight.id)}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> {t("suggestionsOptimized")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* ═══ AI Suggestions ═══ */}
        <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-lg bg-blue-50 dark:bg-blue-950/30 px-4 py-3 text-left">
              <span className="flex items-center gap-2 font-display text-lg font-semibold text-blue-700 dark:text-blue-400">
                <Lightbulb className="h-5 w-5" /> {t("suggestionsAISection")}
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                  {aiSuggestions.length}
                </Badge>
              </span>
              {aiOpen ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            {aiSuggestions.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">{t("suggestionsNoAI")}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <AnimatePresence>
                  {aiSuggestions.map((s, i) => {
                    const Icon = aiIconMap[s.icon];
                    return (
                      <motion.div key={s.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" exit="hidden" layout>
                        <Card className="border-blue-200 dark:border-blue-800/40 shadow-sm hover:shadow-md transition-shadow group">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/40 p-2 shrink-0">
                                <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs text-xs">{s.message}</TooltipContent>
                                  </Tooltip>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{s.message}</p>
                                <div className="mt-2 flex justify-end">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => dismiss(s.id)}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> {t("suggestionsOptimized")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* ═══ Time Machine ═══ */}
        <Collapsible open={timeOpen} onOpenChange={setTimeOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-lg bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-left">
              <span className="flex items-center gap-2 font-display text-lg font-semibold text-amber-700 dark:text-amber-400">
                <Clock className="h-5 w-5" /> {t("suggestionsTimeSection")}
                <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  {timeMachine.length}
                </Badge>
              </span>
              {timeOpen ? <ChevronUp className="h-4 w-4 text-amber-600" /> : <ChevronDown className="h-4 w-4 text-amber-600" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            {timeMachine.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">{t("suggestionsNoTime")}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <AnimatePresence>
                  {timeMachine.map((item, i) => (
                    <motion.div key={item.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" exit="hidden" layout>
                      <Card className="border-amber-200 dark:border-amber-800/40 shadow-sm hover:shadow-md transition-shadow group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-amber-100 dark:bg-amber-900/40 p-2 shrink-0">
                              <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground">{item.title}</p>
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                  {formatCurrency(item.amount, lang)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => dismiss(item.id)}
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t("suggestionsOptimized")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </DashboardLayout>
  );
};

export default Suggestions;
