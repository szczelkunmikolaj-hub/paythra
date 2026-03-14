import { useMemo } from "react";
import type { Subscription } from "./useSubscriptions";
import type { ServicePricing } from "./useServicePricing";

export interface Insight {
  id: string;
  type: "overpaying" | "student" | "family" | "unused" | "duplicate" | "general";
  title: string;
  message: string;
  savingsPerYear: number;
  subscriptionId?: string;
  icon: "alert" | "savings" | "student" | "family" | "unused";
}

interface IntelligenceParams {
  subscriptions: Subscription[];
  services: ServicePricing[];
  isStudent: boolean;
  monthlyIncome: number | null;
}

export const useSubscriptionIntelligence = ({
  subscriptions,
  services,
  isStudent,
  monthlyIncome,
}: IntelligenceParams) => {
  return useMemo(() => {
    const insights: Insight[] = [];
    const active = subscriptions.filter((s) => s.status === "active");

    // Match subscriptions to service pricing
    active.forEach((sub) => {
      const match = services.find(
        (sp) =>
          sp.service_name.toLowerCase() === sub.name.toLowerCase() ||
          sub.name.toLowerCase().includes(sp.service_name.toLowerCase())
      );

      if (!match) return;

      const monthlySubPrice = sub.billing_cycle === "yearly" ? sub.price / 12 : sub.price;

      // Overpaying check
      if (monthlySubPrice > match.standard_price * 1.05) {
        const savings = (monthlySubPrice - match.standard_price) * 12;
        insights.push({
          id: `overpay-${sub.id}`,
          type: "overpaying",
          title: "Possible Overpayment",
          message: `You're paying €${monthlySubPrice.toFixed(2)}/mo for ${sub.name}, but the standard price is €${match.standard_price.toFixed(2)}/mo.`,
          savingsPerYear: savings,
          subscriptionId: sub.id,
          icon: "alert",
        });
      }

      // Student discount check
      if (isStudent && match.student_price && monthlySubPrice > match.student_price) {
        const savings = (monthlySubPrice - match.student_price) * 12;
        insights.push({
          id: `student-${sub.id}`,
          type: "student",
          title: "Student Discount Available",
          message: `Switch ${sub.name} to a student plan for €${match.student_price.toFixed(2)}/mo and save €${savings.toFixed(0)}/year.`,
          savingsPerYear: savings,
          subscriptionId: sub.id,
          icon: "student",
        });
      }

      // Family plan check
      if (match.family_price && monthlySubPrice > match.family_price / 5) {
        const savingsPerPerson = (monthlySubPrice - match.family_price / 5) * 12;
        if (savingsPerPerson > 5) {
          insights.push({
            id: `family-${sub.id}`,
            type: "family",
            title: "Family Plan Savings",
            message: `Join a ${sub.name} family plan (€${match.family_price.toFixed(2)}/mo shared) and save ~€${savingsPerPerson.toFixed(0)}/year per person.`,
            savingsPerYear: savingsPerPerson,
            subscriptionId: sub.id,
            icon: "family",
          });
        }
      }

      // Cheapest plan suggestion
      if (match.cheapest_plan_price !== null && match.cheapest_plan_price < monthlySubPrice && match.cheapest_plan_name) {
        const savings = (monthlySubPrice - match.cheapest_plan_price) * 12;
        if (savings > 10 && !insights.some((i) => i.subscriptionId === sub.id && i.type === "overpaying")) {
          insights.push({
            id: `cheap-${sub.id}`,
            type: "general",
            title: "Cheaper Plan Available",
            message: `${sub.name} offers a "${match.cheapest_plan_name}" plan at €${match.cheapest_plan_price.toFixed(2)}/mo. You could save €${savings.toFixed(0)}/year.`,
            savingsPerYear: savings,
            subscriptionId: sub.id,
            icon: "savings",
          });
        }
      }
    });

    // Unused subscription insights
    active
      .filter((s) => s.is_unused)
      .forEach((sub) => {
        const yearlyCost = sub.billing_cycle === "monthly" ? sub.price * 12 : sub.price;
        insights.push({
          id: `unused-${sub.id}`,
          type: "unused",
          title: "Unused Subscription",
          message: `${sub.name} appears unused. Cancelling could save €${yearlyCost.toFixed(0)}/year.`,
          savingsPerYear: yearlyCost,
          subscriptionId: sub.id,
          icon: "unused",
        });
      });

    // Duplicate category check
    const categoryMap = new Map<string, Subscription[]>();
    active.forEach((s) => {
      const list = categoryMap.get(s.category) || [];
      list.push(s);
      categoryMap.set(s.category, list);
    });
    categoryMap.forEach((subs, cat) => {
      if (subs.length >= 3) {
        insights.push({
          id: `dup-${cat}`,
          type: "duplicate",
          title: "Category Overlap",
          message: `You have ${subs.length} ${cat} subscriptions. Consider consolidating to reduce costs.`,
          savingsPerYear: 0,
          icon: "alert",
        });
      }
    });

    // Total potential savings
    const totalSavings = insights.reduce((sum, i) => sum + i.savingsPerYear, 0);

    // Health score
    const monthlySpend = active.reduce(
      (sum, s) => sum + (s.billing_cycle === "monthly" ? s.price : s.price / 12),
      0
    );
    let healthScore = 100;
    if (monthlyIncome && monthlySpend > monthlyIncome * 0.1) healthScore -= 20;
    if (active.length > 10) healthScore -= 15;
    if (active.some((s) => s.is_unused)) healthScore -= 15;
    if (insights.filter((i) => i.type === "overpaying").length > 0) healthScore -= 10;
    healthScore = Math.max(0, Math.min(100, healthScore));

    // Overload index
    const recommendedLimit = 8;
    const overloadIndex = active.length / recommendedLimit;

    return {
      insights: insights.sort((a, b) => b.savingsPerYear - a.savingsPerYear),
      totalSavings,
      healthScore,
      overloadIndex,
      activeCount: active.length,
      monthlySpend,
      yearlyProjected: monthlySpend * 12 + active.filter((s) => s.billing_cycle === "yearly").reduce((sum, s) => sum + s.price, 0),
    };
  }, [subscriptions, services, isStudent, monthlyIncome]);
};
