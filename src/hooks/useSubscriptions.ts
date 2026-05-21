import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import posthog from "posthog-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { recordPriceChange } from "./usePriceHistory";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Subscription = Tables<"subscriptions">;
export type SubscriptionInsert = Omit<TablesInsert<"subscriptions">, "user_id">;

export const useSubscriptions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("next_billing_date", { ascending: true });
      if (error) throw error;
      return data as Subscription[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (sub: SubscriptionInsert) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({ ...sub, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({ title: "Subscription added" });
      posthog.capture("subscription_added", {
        subscription_name: data.name,
        billing_cycle: data.billing_cycle,
        category: data.category,
        is_trial: data.is_trial,
      });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subscription> & { id: string }) => {
      // Track price changes
      if (updates.price !== undefined && user) {
        const existing = query.data?.find((s) => s.id === id);
        if (existing && existing.price !== updates.price) {
          await recordPriceChange(user.id, id, existing.price, updates.price);
        }
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["price_history"] });
      toast({ title: "Subscription updated" });
      posthog.capture("subscription_updated", {
        subscription_name: data.name,
        billing_cycle: data.billing_cycle,
        category: data.category,
      });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subscriptions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({ title: "Subscription deleted" });
      posthog.capture("subscription_deleted");
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return {
    subscriptions: query.data ?? [],
    isLoading: query.isLoading,
    addSubscription: addMutation.mutateAsync,
    updateSubscription: updateMutation.mutateAsync,
    deleteSubscription: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
};
