import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlanType = "free" | "premium" | "business";

const VALID_DISCOUNT_CODE = "TheLesters67";
const TEST_MODE_KEY = "paythra_test_mode";

export interface PlanLimits {
  maxSubscriptions: number;
  autoDetection: boolean;
  emailNotifications: boolean;
  advancedAnalytics: boolean;
  exportData: boolean;
  teamSupport: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxSubscriptions: 5,
    autoDetection: false,
    emailNotifications: false,
    advancedAnalytics: false,
    exportData: false,
    teamSupport: false,
  },
  premium: {
    maxSubscriptions: 20,
    autoDetection: true,
    emailNotifications: true,
    advancedAnalytics: false,
    exportData: false,
    teamSupport: false,
  },
  business: {
    maxSubscriptions: Infinity,
    autoDetection: true,
    emailNotifications: true,
    advancedAnalytics: true,
    exportData: true,
    teamSupport: true,
  },
};

export const useUserPlan = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isTestMode, setIsTestMode] = useState(() => {
    try { return localStorage.getItem(TEST_MODE_KEY) === "true"; } catch { return false; }
  });

  const query = useQuery({
    queryKey: ["user_plan", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_plans")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const hasValidDiscount = query.data?.discount_code === VALID_DISCOUNT_CODE;

  const plan: PlanType = hasValidDiscount
    ? "business"
    : isTestMode
      ? "premium"
      : ((query.data?.plan as PlanType) ?? "free");

  const limits = PLAN_LIMITS[plan];

  const upgradeMutation = useMutation({
    mutationFn: async (newPlan: PlanType) => {
      if (query.data) {
        const { error } = await supabase
          .from("user_plans")
          .update({ plan: newPlan, updated_at: new Date().toISOString() })
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_plans")
          .insert({ user_id: user!.id, plan: newPlan });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_plan"] });
    },
  });

  const applyDiscountCode = async (code: string): Promise<boolean> => {
    if (code !== VALID_DISCOUNT_CODE) return false;
    if (query.data) {
      const { error } = await supabase
        .from("user_plans")
        .update({ discount_code: code, plan: "business", updated_at: new Date().toISOString() })
        .eq("user_id", user!.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("user_plans")
        .insert({ user_id: user!.id, plan: "business", discount_code: code });
      if (error) throw error;
    }
    queryClient.invalidateQueries({ queryKey: ["user_plan"] });
    return true;
  };

  const removeDiscountCode = async () => {
    if (!query.data) return;
    const { error } = await supabase
      .from("user_plans")
      .update({ discount_code: null, plan: "free", updated_at: new Date().toISOString() })
      .eq("user_id", user!.id);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["user_plan"] });
  };

  const activateTestMode = async () => {
    localStorage.setItem(TEST_MODE_KEY, "true");
    setIsTestMode(true);
  };

  const deactivateTestMode = async () => {
    localStorage.removeItem(TEST_MODE_KEY);
    setIsTestMode(false);
  };

  return {
    plan,
    limits,
    isLoading: query.isLoading,
    upgradePlan: upgradeMutation.mutateAsync,
    isUpgrading: upgradeMutation.isPending,
    hasValidDiscount,
    applyDiscountCode,
    removeDiscountCode,
    isTestMode,
    activateTestMode,
    deactivateTestMode,
  };
};
