import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { Subscription } from "./useSubscriptions";
import type { Transaction } from "./useTransactions";

export const useUnusedDetection = (subscriptions: Subscription[], transactions: Transaction[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || subscriptions.length === 0) return;
    let cancelled = false;

    const detect = async () => {
      const now = new Date();
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const active = subscriptions.filter((s) => s.status === "active" && !s.is_unused);

      for (const sub of active) {
        if (cancelled) return;

        const recentTx = transactions.some(
          (tx) =>
            tx.merchant.toLowerCase().includes(sub.name.toLowerCase()) &&
            new Date(tx.date) >= sixtyDaysAgo
        );

        if (transactions.length > 0 && !recentTx) {
          const hasOlderTx = transactions.some(
            (tx) => tx.merchant.toLowerCase().includes(sub.name.toLowerCase())
          );
          if (hasOlderTx) {
            await supabase
              .from("subscriptions")
              .update({ is_unused: true })
              .eq("id", sub.id);

            if (cancelled) return;

            const todayStart = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
            const { data: existing } = await supabase
              .from("notifications")
              .select("id")
              .eq("user_id", user.id)
              .eq("subscription_id", sub.id)
              .eq("type", "unused_subscription")
              .gte("created_at", todayStart)
              .limit(1);

            if (cancelled) return;

            if (!existing || existing.length === 0) {
              await supabase.from("notifications").insert({
                user_id: user.id,
                subscription_id: sub.id,
                type: "unused_subscription",
                message: `${sub.name} appears unused — no transactions in the last 60 days.`,
              });
            }

            if (!cancelled) {
              queryClient.invalidateQueries({ queryKey: ["subscriptions", user.id] });
              queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
            }
          }
        }
      }
    };

    detect();
    return () => { cancelled = true; };
  }, [user, subscriptions.length, transactions.length, queryClient]);
};
