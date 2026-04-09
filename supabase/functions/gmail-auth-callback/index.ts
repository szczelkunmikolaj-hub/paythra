import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  console.log("[gmail-auth-callback] Starting. code exists:", !!code, "state exists:", !!stateRaw, "error:", error);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
  const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

  // Decode state to get userId and origin
  let userId: string | null = null;
  let appOrigin = "https://subsense-guard.lovable.app";

  if (stateRaw) {
    try {
      const decoded = JSON.parse(atob(stateRaw));
      userId = decoded.userId || null;
      appOrigin = decoded.origin || appOrigin;
      console.log("[gmail-auth-callback] Decoded state - userId:", userId, "origin:", appOrigin);
    } catch (e) {
      userId = stateRaw;
      console.log("[gmail-auth-callback] State is plain string userId:", userId);
    }
  }

  if (error) {
    console.error("[gmail-auth-callback] Google returned error:", error);
    return Response.redirect(`${appOrigin}/dashboard?gmail_error=auth_failed`, 302);
  }

  if (!code) {
    console.error("[gmail-auth-callback] No authorization code in URL");
    return new Response(JSON.stringify({ error: "No authorization code" }), { status: 400 });
  }

  if (!userId) {
    console.error("[gmail-auth-callback] No userId found in state parameter");
    return new Response(JSON.stringify({ error: "No user ID" }), { status: 400 });
  }

  try {
    // 1. Exchange code for tokens
    const redirectUri = `${SUPABASE_URL}/functions/v1/gmail-auth-callback`;
    console.log("[gmail-auth-callback] Exchanging code for tokens. redirect_uri:", redirectUri);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("[gmail-auth-callback] Token response status:", tokenRes.status, "has access_token:", !!tokenData.access_token, "has refresh_token:", !!tokenData.refresh_token, "expires_in:", tokenData.expires_in);

    if (!tokenRes.ok) {
      console.error("[gmail-auth-callback] Token exchange failed:", JSON.stringify(tokenData));
      return Response.redirect(`${appOrigin}/dashboard?gmail_error=token_failed`, 302);
    }

    if (!tokenData.access_token) {
      console.error("[gmail-auth-callback] No access_token in response:", JSON.stringify(tokenData));
      return Response.redirect(`${appOrigin}/dashboard?gmail_error=no_token`, 302);
    }

    // 2. Get user's Gmail address
    const profileRes = await fetch("https://www.googleapis.com/gmail/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();
    console.log("[gmail-auth-callback] Gmail profile email:", profileData.emailAddress);

    // 3. Save to database using service role client (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const expiresAt = new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString();

    // First delete any existing connection for this user
    const { error: deleteError } = await supabase
      .from("gmail_connections")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("[gmail-auth-callback] Delete existing connection error:", JSON.stringify(deleteError));
    }

    // Then insert fresh row
    const insertPayload = {
      user_id: userId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || "",
      token_expires_at: expiresAt,
      email: profileData.emailAddress || null,
    };
    console.log("[gmail-auth-callback] Inserting row for user:", userId, "email:", insertPayload.email, "expires_at:", expiresAt);

    const { data: insertData, error: dbError } = await supabase
      .from("gmail_connections")
      .insert(insertPayload)
      .select();

    if (dbError) {
      console.error("[gmail-auth-callback] INSERT FAILED:", JSON.stringify(dbError));
      return new Response(
        JSON.stringify({ error: "Failed to save Gmail connection", details: dbError }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[gmail-auth-callback] INSERT SUCCESS. Row:", JSON.stringify(insertData));
    return Response.redirect(`${appOrigin}/dashboard?gmail_connected=true`, 302);
  } catch (err) {
    console.error("[gmail-auth-callback] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
