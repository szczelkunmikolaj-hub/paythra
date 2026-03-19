import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

type Subscription = Tables<"subscriptions">;

/**
 * Detects price changes by comparing current subscription prices
 * against the last recorded price in subscription_price_history.
 * Also fires a notification when a new subscription is added.
 */
export const usePriceChangeDetection = (subscriptions: Subscription[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const prevIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user || subscriptions.length === 0) return;

    const checkPriceChanges = async () => {
      // Fetch most recent price history per subscription
      const { data: history } = await supabase
        .from("subscription_price_history")
        .select("*")
        .eq("user_id", user.id)
        .order("date_changed", { ascending: false });

      if (!history) return;

      // Get latest price per subscription_id
      const latestPrices = new Map<string, number>();
      for (const h of history) {
        if (!latestPrices.has(h.subscription_id)) {
          latestPrices.set(h.subscription_id, h.new_price);
        }
      }

      for (const sub of subscriptions) {
        const lastKnown = latestPrices.get(sub.id);
        if (lastKnown !== undefined && lastKnown !== sub.price) {
          // Price changed! Record it
          const direction = sub.price > lastKnown ? "increased" : "decreased";

          await supabase.from("subscription_price_history").insert({
            user_id: user.id,
            subscription_id: sub.id,
            old_price: lastKnown,
            new_price: sub.price,
          });

          // Check if we already notified about this
          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", user.id)
            .eq("subscription_id", sub.id)
            .eq("type", direction === "increased" ? "price_increase" : "price_decrease")
            .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          if (!existing || existing.length === 0) {
            await supabase.from("notifications").insert({
              user_id: user.id,
              subscription_id: sub.id,
              type: direction === "increased" ? "price_increase" : "price_decrease",
              message: `${sub.name} price ${direction}: €${lastKnown.toFixed(2)} → €${sub.price.toFixed(2)}`,
            });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          }
        }
      }
    };

    // Detect new subscriptions added
    const currentIds = new Set(subscriptions.map((s) => s.id));
    if (prevIds.current.size > 0) {
      for (const id of currentIds) {
        if (!prevIds.current.has(id)) {
          const sub = subscriptions.find((s) => s.id === id);
          if (sub) {
            supabase.from("notifications").insert({
              user_id: user.id,
              subscription_id: sub.id,
              type: "subscription_added",
              message: `New subscription added: ${sub.name} (€${sub.price.toFixed(2)}/${sub.billing_cycle})`,
            }).then(() => {
              queryClient.invalidateQueries({ queryKey: ["notifications"] });
            });
          }
        }
      }
    }
    prevIds.current = currentIds;

    checkPriceChanges();
  }, [user, subscriptions, queryClient]);
};
