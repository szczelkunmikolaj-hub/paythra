import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface PaythraEmailRequest {
  id: string;
  user_id: string;
  user_email: string;
  requested_name: string;
  suggested_email: string;
  status: "pending" | "created" | "sent";
  created_at: string;
  updated_at: string;
}

export const sanitizeName = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);

export const toSuggestedEmail = (name: string): string => {
  const slug = sanitizeName(name);
  return slug ? `${slug}@mail.paythra.com` : "";
};

export const usePaythraEmailRequest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["paythra_email_request", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("paythra_email_requests")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as PaythraEmailRequest | null;
    },
    enabled: !!user,
  });

  const submit = useMutation({
    mutationFn: async (name: string) => {
      const suggested = toSuggestedEmail(name);
      if (!suggested) throw new Error("Name must contain at least one letter.");

      const { data, error } = await (supabase as any)
        .from("paythra_email_requests")
        .insert({
          user_id: user!.id,
          user_email: user!.email,
          requested_name: name.trim(),
          suggested_email: suggested,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") throw new Error("You already have a request on file.");
        throw error;
      }
      return data as PaythraEmailRequest;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["paythra_email_request", user?.id], data);
      toast({
        title: "Request submitted!",
        description: `We'll set up ${data.suggested_email} and email you within 24 hours.`,
      });
    },
    onError: (e: Error) =>
      toast({ title: "Couldn't submit request", description: e.message, variant: "destructive" }),
  });

  return {
    request: query.data ?? null,
    isLoading: query.isLoading,
    submit: submit.mutateAsync,
    isSubmitting: submit.isPending,
  };
};
