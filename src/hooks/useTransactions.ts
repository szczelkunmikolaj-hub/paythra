import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

export type Transaction = Tables<"transactions">;

export interface DetectedSubscription {
  merchant: string;
  amount: number;
  cycle: "monthly" | "yearly";
  occurrences: number;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (tx: Omit<Transaction, "id" | "created_at" | "user_id">) => {
      const { error } = await supabase.from("transactions").insert({ ...tx, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
      toast({ title: "Transaction added" });
    },
  });

  // Detect recurring patterns
  const detectSubscriptions = (): DetectedSubscription[] => {
    const txs = query.data ?? [];
    const grouped: Record<string, Transaction[]> = {};

    txs.forEach((tx) => {
      const key = `${tx.merchant.toLowerCase()}_${tx.amount}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(tx);
    });

    const detected: DetectedSubscription[] = [];

    Object.values(grouped).forEach((txGroup) => {
      if (txGroup.length < 2) return;

      const sorted = txGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const gaps: number[] = [];

      for (let i = 1; i < sorted.length; i++) {
        const diff = (new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / (1000 * 60 * 60 * 24);
        gaps.push(diff);
      }

      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;

      if (avgGap >= 28 && avgGap <= 31) {
        detected.push({
          merchant: txGroup[0].merchant,
          amount: txGroup[0].amount,
          cycle: "monthly",
          occurrences: txGroup.length,
        });
      } else if (avgGap >= 350 && avgGap <= 380) {
        detected.push({
          merchant: txGroup[0].merchant,
          amount: txGroup[0].amount,
          cycle: "yearly",
          occurrences: txGroup.length,
        });
      }
    });

    return detected;
  };

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    addTransaction: addTransaction.mutateAsync,
    detectSubscriptions,
  };
};
