import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";
import type { Subscription } from "./useSubscriptions";

export const useUpcomingChargeNotifications = (subscriptions: Subscription[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    if (!user || subscriptions.length === 0) return;
    let cancelled = false;

    const checkUpcoming = async () => {
      const active = subscriptions.filter((s) => s.status === "active" && !s.is_trial);
      const now = new Date();
      const todayStart = now.toISOString().split("T")[0] + "T00:00:00.000Z";

      for (const sub of active) {
        if (cancelled) return;

        const billingDate = new Date(sub.next_billing_date);
        const daysUntil = Math.ceil((billingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil === 1 || daysUntil === 3) {
          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", user.id)
            .eq("subscription_id", sub.id)
            .eq("type", "upcoming_charge")
            .gte("created_at", todayStart)
            .limit(1);

          if (cancelled) return;

          if (!existing || existing.length === 0) {
            const amount = formatCurrency(sub.price, lang);
            const message =
              daysUntil === 1
                ? `${sub.name} will charge you tomorrow (${amount})`
                : `${sub.name} will charge you in 3 days (${amount})`;

            await supabase.from("notifications").insert({
              user_id: user.id,
              subscription_id: sub.id,
              type: "upcoming_charge",
              message,
            });

            if (!cancelled) {
              queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
            }
          }
        }
      }
    };

    checkUpcoming();
    return () => { cancelled = true; };
  }, [user, subscriptions, queryClient, lang]);
};
