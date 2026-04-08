import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state");
  const error = url.searchParams.get("error");

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
    } catch {
      // Legacy: state might just be a plain user_id string
      userId = stateRaw;
    }
  }

  if (error || !code || !userId) {
    console.error("OAuth error or missing params:", { error, hasCode: !!code, hasUserId: !!userId });
    return Response.redirect(`${appOrigin}/dashboard?gmail_error=auth_failed`, 302);
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${SUPABASE_URL}/functions/v1/gmail-auth-callback`;
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
    if (!tokenRes.ok) {
      console.error("Token exchange failed:", tokenData);
      return Response.redirect(`${appOrigin}/dashboard?gmail_error=token_failed`, 302);
    }

    if (!tokenData.access_token) {
      console.error("No access_token in response:", tokenData);
      return Response.redirect(`${appOrigin}/dashboard?gmail_error=no_token`, 302);
    }

    // Get user's Gmail address
    const profileRes = await fetch("https://www.googleapis.com/gmail/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const expiresAt = new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString();

    // Upsert gmail connection
    const { error: dbError } = await supabase
      .from("gmail_connections")
      .upsert(
        {
          user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || "",
          token_expires_at: expiresAt,
          email: profileData.emailAddress || null,
        },
        { onConflict: "user_id" }
      );

    if (dbError) {
      console.error("DB upsert error:", dbError);
      return Response.redirect(`${appOrigin}/dashboard?gmail_error=db_failed`, 302);
    }

    console.log("Gmail connected successfully for user:", userId);
    return Response.redirect(`${appOrigin}/dashboard?gmail_connected=true`, 302);
  } catch (err) {
    console.error("Gmail auth callback error:", err);
    return Response.redirect(`${appOrigin}/dashboard?gmail_error=unknown`, 302);
  }
});
