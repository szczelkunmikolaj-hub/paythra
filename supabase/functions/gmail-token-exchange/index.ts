import { corsHeaders } from "@supabase/supabase-js/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, code_verifier, redirect_uri } = await req.json();

    if (!code || !code_verifier || !redirect_uri) {
      return new Response(
        JSON.stringify({ error: "Missing code, code_verifier, or redirect_uri" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client_id = Deno.env.get("GOOGLE_CLIENT_ID");
    const client_secret = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!client_id || !client_secret) {
      return new Response(
        JSON.stringify({ error: "Server is missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = new URLSearchParams({
      client_id,
      client_secret,
      code,
      code_verifier,
      redirect_uri,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      console.error("[gmail-token-exchange] Google rejected:", tokenRes.status, tokenText);
      return new Response(
        JSON.stringify({ error: "Token exchange failed", details: tokenText }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = JSON.parse(tokenText);
    const access_token = tokenData.access_token as string;

    // Best-effort fetch of email for display
    let email: string | null = null;
    try {
      const profileRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/profile",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      if (profileRes.ok) {
        const p = await profileRes.json();
        email = p.emailAddress ?? null;
      }
    } catch (_) {
      /* non-fatal */
    }

    return new Response(
      JSON.stringify({
        access_token,
        expires_in: tokenData.expires_in ?? 3600,
        scope: tokenData.scope,
        email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[gmail-token-exchange] Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
