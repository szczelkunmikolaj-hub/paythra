import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface SharedPlanRequest {
  id: string;
  user_id: string;
  user_email: string;
  subscription_name: string;
  subscription_category: string;
  max_members: number;
  current_members: number;
  status: "waiting" | "full" | "active";
  monthly_cost_per_person: number;
  created_at: string;
  updated_at: string;
}

export interface SharedPlanMember {
  id: string;
  plan_id: string;
  user_id: string;
  user_email: string;
  status: "pending" | "confirmed" | "left";
  joined_at: string;
}

export const useSharedPlans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const openPlansQuery = useQuery({
    queryKey: ["shared_plans_open"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shared_plan_requests")
        .select("*")
        .eq("status", "waiting")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SharedPlanRequest[];
    },
    enabled: !!user,
  });

  const myPlansQuery = useQuery({
    queryKey: ["shared_plans_mine", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shared_plan_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SharedPlanRequest[];
    },
    enabled: !!user,
  });

  const myMembershipsQuery = useQuery({
    queryKey: ["shared_plan_memberships", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shared_plan_members")
        .select("*")
        .eq("user_id", user!.id)
        .neq("status", "left");
      if (error) throw error;
      return data as SharedPlanMember[];
    },
    enabled: !!user,
  });

  const createPlan = useMutation({
    mutationFn: async (plan: {
      subscription_name: string;
      subscription_category: string;
      max_members: number;
      monthly_cost_per_person: number;
    }) => {
      const { data, error } = await (supabase as any)
        .from("shared_plan_requests")
        .insert({
          user_id: user!.id,
          user_email: user!.email,
          ...plan,
        })
        .select()
        .single();
      if (error) throw error;
      return data as SharedPlanRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared_plans_open"] });
      queryClient.invalidateQueries({ queryKey: ["shared_plans_mine", user?.id] });
      toast({ title: "Plan created", description: "Your shared plan is now visible to others." });
    },
    onError: (e: Error) => toast({ title: "Failed to create plan", description: e.message, variant: "destructive" }),
  });

  const joinPlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await (supabase as any)
        .from("shared_plan_members")
        .insert({
          plan_id: planId,
          user_id: user!.id,
          user_email: user!.email,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared_plans_open"] });
      queryClient.invalidateQueries({ queryKey: ["shared_plan_memberships", user?.id] });
      toast({ title: "Joined plan", description: "You've joined the shared plan. The owner will be in touch." });
    },
    onError: (e: Error) => toast({ title: "Failed to join plan", description: e.message, variant: "destructive" }),
  });

  const leavePlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await (supabase as any)
        .from("shared_plan_members")
        .update({ status: "left" })
        .eq("plan_id", planId)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared_plans_open"] });
      queryClient.invalidateQueries({ queryKey: ["shared_plan_memberships", user?.id] });
      toast({ title: "Left plan" });
    },
    onError: (e: Error) => toast({ title: "Failed to leave plan", description: e.message, variant: "destructive" }),
  });

  const deletePlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await (supabase as any)
        .from("shared_plan_requests")
        .delete()
        .eq("id", planId)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared_plans_open"] });
      queryClient.invalidateQueries({ queryKey: ["shared_plans_mine", user?.id] });
      toast({ title: "Plan removed" });
    },
    onError: (e: Error) => toast({ title: "Failed to remove plan", description: e.message, variant: "destructive" }),
  });

  const joinedPlanIds = new Set((myMembershipsQuery.data ?? []).map((m) => m.plan_id));

  return {
    openPlans: openPlansQuery.data ?? [],
    myPlans: myPlansQuery.data ?? [],
    joinedPlanIds,
    isLoading: openPlansQuery.isLoading || myPlansQuery.isLoading,
    createPlan: createPlan.mutateAsync,
    joinPlan: joinPlan.mutateAsync,
    leavePlan: leavePlan.mutateAsync,
    deletePlan: deletePlan.mutateAsync,
    isCreating: createPlan.isPending,
    isJoining: joinPlan.isPending,
  };
};
