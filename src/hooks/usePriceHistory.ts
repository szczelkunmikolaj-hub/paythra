import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PriceChange {
  id: string;
  subscription_id: string;
  user_id: string;
  old_price: number;
  new_price: number;
  date_changed: string;
}

export const usePriceHistory = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["price_history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_price_history")
        .select("*")
        .order("date_changed", { ascending: false });
      if (error) throw error;
      return data as PriceChange[];
    },
    enabled: !!user,
  });

  return {
    priceHistory: query.data ?? [],
    isLoading: query.isLoading,
  };
};

export const recordPriceChange = async (
  userId: string,
  subscriptionId: string,
  oldPrice: number,
  newPrice: number
) => {
  if (oldPrice === newPrice) return;
  await supabase.from("subscription_price_history").insert({
    user_id: userId,
    subscription_id: subscriptionId,
    old_price: oldPrice,
    new_price: newPrice,
  });

  // Create notification for price increase
  if (newPrice > oldPrice) {
    await supabase.from("notifications").insert({
      user_id: userId,
      subscription_id: subscriptionId,
      type: "price_increase",
      message: `Price increase detected: €${oldPrice.toFixed(2)} → €${newPrice.toFixed(2)}`,
    });
  }
};
