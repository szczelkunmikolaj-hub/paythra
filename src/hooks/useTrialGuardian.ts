import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { Subscription } from "./useSubscriptions";

export const useTrialGuardian = (subscriptions: Subscription[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    if (!user || subscriptions.length === 0) return;
    let cancelled = false;

    const checkTrials = async () => {
      const trials = subscriptions.filter((s) => s.is_trial && s.trial_end_date && s.status === "active");
      const now = new Date();

      for (const trial of trials) {
        if (cancelled) return;
        const endDate = new Date(trial.trial_end_date!);
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1 || daysLeft <= 0) {
          const todayStart = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", user.id)
            .eq("subscription_id", trial.id)
            .eq("type", "trial_ending")
            .gte("created_at", todayStart)
            .limit(1);

          if (cancelled) return;

          if (!existing || existing.length === 0) {
            const message =
              daysLeft <= 0
                ? `Free trial for ${trial.name} has expired! It may convert to a paid subscription.`
                : `Free trial for ${trial.name} ends in ${daysLeft} day${daysLeft > 1 ? "s" : ""}!`;

            await supabase.from("notifications").insert({
              user_id: user.id,
              subscription_id: trial.id,
              type: "trial_ending",
              message,
            });

            if (!cancelled) {
              queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
            }
          }
        }
      }
    };

    checkTrials();
    return () => { cancelled = true; };
  }, [user, subscriptions, queryClient, lang]);
};
