import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlanType = "free" | "premium" | "business";

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

  const hasValidDiscount = !!query.data?.discount_code;

  const plan: PlanType = hasValidDiscount
    ? "business"
    : isTestMode
      ? "premium"
      : ((query.data?.plan as PlanType) ?? "free");

  const limits = PLAN_LIMITS[plan];

  const upgradeMutation = useMutation({
    mutationFn: async (newPlan: PlanType) => {
      const { data, error } = await supabase.functions.invoke("upgrade-plan", {
        body: { plan: newPlan },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_plan"] });
    },
  });

  const applyDiscountCode = async (code: string): Promise<boolean> => {
    const { data, error } = await supabase.functions.invoke("redeem-discount-code", {
      body: { code, action: "apply" },
    });
    if (error) return false;
    if (!data?.success) return false;
    queryClient.invalidateQueries({ queryKey: ["user_plan"] });
    return true;
  };

  const removeDiscountCode = async () => {
    const { error } = await supabase.functions.invoke("redeem-discount-code", {
      body: { action: "remove" },
    });
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
