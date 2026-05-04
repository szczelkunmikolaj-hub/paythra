import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { getDatabaseEntryByName, getDatabasePriceEUR } from "@/data/subscriptionDatabase";

type Subscription = Tables<"subscriptions">;

/**
 * Compares each user subscription's saved price to the current price in the
 * master subscription database. If they differ, records the change in
 * subscription_price_history and creates a notification.
 *
 * Runs once per dashboard mount.
 */
export const useDatabasePriceCheck = (subscriptions: Subscription[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || subscriptions.length === 0 || hasRun.current) return;
    hasRun.current = true;

    (async () => {
      for (const sub of subscriptions) {
        const entry = getDatabaseEntryByName(sub.name);
        if (!entry) continue;

        const cycle = (sub.billing_cycle === "yearly" ? "yearly" : "monthly") as "monthly" | "yearly";
        const dbPrice = getDatabasePriceEUR(entry, cycle);
        if (dbPrice == null) continue;

        const diff = Math.abs(dbPrice - sub.price);
        // Ignore tiny rounding noise
        if (diff < 0.01) continue;

        // Skip if we already notified for this exact change recently (24h)
        const direction = dbPrice > sub.price ? "increased" : "decreased";
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.id)
          .eq("subscription_id", sub.id)
          .eq("type", direction === "increased" ? "price_increase" : "price_decrease")
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(1);

        if (existing && existing.length > 0) continue;

        await supabase.from("subscription_price_history").insert({
          user_id: user.id,
          subscription_id: sub.id,
          old_price: sub.price,
          new_price: dbPrice,
        });

        await supabase.from("notifications").insert({
          user_id: user.id,
          subscription_id: sub.id,
          type: direction === "increased" ? "price_increase" : "price_decrease",
          message: `Price change detected: ${sub.name} ${direction} from €${sub.price.toFixed(2)} to €${dbPrice.toFixed(2)}`,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    })();
  }, [user, subscriptions, queryClient]);
};
