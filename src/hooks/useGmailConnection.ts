import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GmailConnection {
  id: string;
  user_id: string;
  email: string | null;
  connected_at: string;
  last_scan_at: string | null;
}

export interface DetectedSubscription {
  name: string;
  price: number | null;
  billing_cycle: string;
  category: string;
  source_email: string;
  confidence: number;
}

export const useGmailConnection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const connectionQuery = useQuery({
    queryKey: ["gmail_connection", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gmail_connections")
        .select("id, user_id, email, connected_at, last_scan_at")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as GmailConnection | null;
    },
    enabled: !!user,
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/gmail-scan-emails`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Scan failed");
      }
      return res.json() as Promise<{ detected: DetectedSubscription[]; scanned: number }>;
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/gmail-disconnect`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Disconnect failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail_connection"] });
    },
  });

  const connectGmail = () => {
    if (!user) return;
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const redirectUri = encodeURIComponent(
      `https://${projectId}.supabase.co/functions/v1/gmail-auth-callback`
    );
    const clientId = "640863753608-e2g9mvhohjvh6p6q9nee5tpv5vq1bce5.apps.googleusercontent.com";
    const scope = encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly");
    // Encode both user_id and origin in state since Google doesn't forward custom params
    const statePayload = btoa(JSON.stringify({ userId: user.id, origin: window.location.origin }));
    const encodedState = encodeURIComponent(statePayload);

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${encodedState}`;

    window.location.href = authUrl;
  };

  // Handle redirect params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gmail_connected") === "true") {
      queryClient.invalidateQueries({ queryKey: ["gmail_connection"] });
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("gmail_error")) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [queryClient]);

  return {
    connection: connectionQuery.data,
    isConnected: !!connectionQuery.data,
    isLoading: connectionQuery.isLoading,
    connectGmail,
    disconnectGmail: disconnectMutation.mutateAsync,
    isDisconnecting: disconnectMutation.isPending,
    scanEmails: scanMutation.mutateAsync,
    isScanning: scanMutation.isPending,
    scanResults: scanMutation.data,
  };
};
