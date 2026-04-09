import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { Subscription } from "./useSubscriptions";

export const useUpcomingChargeNotifications = (subscriptions: Subscription[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || subscriptions.length === 0) return;

    const checkUpcoming = async () => {
      const active = subscriptions.filter((s) => s.status === "active" && !s.is_trial);
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      for (const sub of active) {
        const billingDate = new Date(sub.next_billing_date);
        const daysUntil = Math.ceil((billingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil === 1 || daysUntil === 3) {
          // Check if we already sent this notification today
          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", user.id)
            .eq("subscription_id", sub.id)
            .eq("type", "upcoming_charge")
            .gte("created_at", today)
            .limit(1);

          if (!existing || existing.length === 0) {
            const message =
              daysUntil === 1
                ? `${sub.name} will charge you tomorrow (€${sub.price.toFixed(2)})`
                : `${sub.name} will charge you in 3 days (€${sub.price.toFixed(2)})`;

            await supabase.from("notifications").insert({
              user_id: user.id,
              subscription_id: sub.id,
              type: "upcoming_charge",
              message,
            });

            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          }
        }
      }
    };

    checkUpcoming();
  }, [user, subscriptions, queryClient]);
};
