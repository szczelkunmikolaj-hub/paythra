// Server-side plan upgrade endpoint.
// Note: this currently does NOT verify a payment receipt — payment integration
// should be wired here before going to production. Keeping the endpoint
// server-side is still an improvement: it removes direct client write
// access to the `user_plans.plan` column (RLS now blocks that), and gives
// us a single place to add Stripe/Paddle verification later.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_PLANS = new Set(["free", "premium", "business"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const plan = typeof body?.plan === "string" ? body.plan : "";
    if (!ALLOWED_PLANS.has(plan)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TODO: verify payment / trial eligibility here before promoting.

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: existing } = await adminClient
      .from("user_plans")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { error } = await adminClient
        .from("user_plans")
        .update({ plan, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (error) throw error;
    } else {
      const { error } = await adminClient
        .from("user_plans")
        .insert({ user_id: userId, plan });
      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true, plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
