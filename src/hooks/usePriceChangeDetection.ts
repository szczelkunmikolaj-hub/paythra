import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";
import type { Tables } from "@/integrations/supabase/types";

type Subscription = Tables<"subscriptions">;

export const usePriceChangeDetection = (subscriptions: Subscription[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const prevIds = useRef<Set<string>>(new Set());
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    if (!user || subscriptions.length === 0) return;
    let cancelled = false;

    const checkPriceChanges = async () => {
      const { data: history } = await supabase
        .from("subscription_price_history")
        .select("*")
        .eq("user_id", user.id)
        .order("date_changed", { ascending: false });

      if (!history || cancelled) return;

      const latestPrices = new Map<string, number>();
      for (const h of history) {
        if (!latestPrices.has(h.subscription_id)) {
          latestPrices.set(h.subscription_id, h.new_price);
        }
      }

      for (const sub of subscriptions) {
        if (cancelled) return;

        const lastKnown = latestPrices.get(sub.id);
        if (lastKnown !== undefined && lastKnown !== sub.price) {
          const direction = sub.price > lastKnown ? "increased" : "decreased";

          await supabase.from("subscription_price_history").insert({
            user_id: user.id,
            subscription_id: sub.id,
            old_price: lastKnown,
            new_price: sub.price,
          });

          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", user.id)
            .eq("subscription_id", sub.id)
            .eq("type", direction === "increased" ? "price_increase" : "price_decrease")
            .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          if (cancelled) return;

          if (!existing || existing.length === 0) {
            await supabase.from("notifications").insert({
              user_id: user.id,
              subscription_id: sub.id,
              type: direction === "increased" ? "price_increase" : "price_decrease",
              message: `${sub.name} price ${direction}: ${formatCurrency(lastKnown, lang)} → ${formatCurrency(sub.price, lang)}`,
            });

            if (!cancelled) {
              queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
            }
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
              message: `New subscription added: ${sub.name} (${formatCurrency(sub.price, lang)}/${sub.billing_cycle})`,
            }).then(() => {
              if (!cancelled) {
                queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
              }
            });
          }
        }
      }
    }
    prevIds.current = currentIds;

    checkPriceChanges();
    return () => { cancelled = true; };
  }, [user, subscriptions, queryClient, lang]);
};
