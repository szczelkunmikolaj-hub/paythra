import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface SubscriptionHistoryRow {
  id: string;
  user_id: string;
  service_name: string;
  service_color: string | null;
  service_domain: string | null;
  monthly_price: number;
  started_at: string; // YYYY-MM-DD
  ended_at: string | null;
  created_at: string;
}

export interface SubscriptionHistoryInsert {
  service_name: string;
  service_color?: string | null;
  service_domain?: string | null;
  monthly_price: number;
  started_at: string;
  ended_at?: string | null;
}

export const useSubscriptionHistory = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["subscription_history", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("subscription_history")
        .select("*")
        .order("started_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as SubscriptionHistoryRow[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (row: SubscriptionHistoryInsert) => {
      const { data, error } = await (supabase as any)
        .from("subscription_history")
        .insert({ ...row, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as SubscriptionHistoryRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription_history"] });
      toast({ title: "Past subscription added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    addHistory: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
};
