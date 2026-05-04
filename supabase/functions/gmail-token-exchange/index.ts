import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await anonClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { code, code_verifier, redirect_uri } = await req.json();
    if (!code || !code_verifier || !redirect_uri) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID") ?? "";
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "";

    console.log("[gmail-token-exchange] exchanging code", {
      redirect_uri,
      client_id_suffix: clientId.slice(-20),
      has_secret: !!clientSecret,
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        code_verifier,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[gmail-token-exchange] Google rejected:", response.status, data);
      // Return 200 with error payload so the client can read the real reason
      // (supabase.functions.invoke swallows the body on non-2xx).
      return new Response(
        JSON.stringify({
          error: data.error || "token_exchange_failed",
          error_description: data.error_description || JSON.stringify(data),
          google_status: response.status,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Try to fetch the user's email (best-effort)
    let email: string | undefined;
    try {
      const profile = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${data.access_token}` } },
      );
      if (profile.ok) {
        const p = await profile.json();
        email = p.email;
      }
    } catch (_) { /* ignore */ }

    // Persist the connection against the authenticated Supabase user (never by email).
    const expiresAt = new Date(Date.now() + ((data.expires_in ?? 3600) * 1000)).toISOString();
    const { error: upsertError } = await anonClient
      .from("gmail_connections")
      .upsert(
        {
          user_id: userData.user.id,
          email: email ?? null,
          access_token: data.access_token,
          refresh_token: data.refresh_token ?? "",
          token_expires_at: expiresAt,
          connected_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (upsertError) {
      console.error("[gmail-token-exchange] failed to save connection:", upsertError);
      return new Response(
        JSON.stringify({
          error: "save_failed",
          error_description: upsertError.message,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ...data, email, success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[gmail-token-exchange] unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "internal_error", error_description: (err as Error).message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
