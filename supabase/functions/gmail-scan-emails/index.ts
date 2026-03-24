import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUBSCRIPTION_KEYWORDS = [
  "subscription", "renewal", "recurring", "monthly charge", "annual charge",
  "payment confirmation", "invoice", "receipt", "billing", "your plan",
  "membership", "auto-renewal", "trial ending", "upgrade", "premium",
];

const KNOWN_SERVICES: Record<string, { category: string; domain: string }> = {
  netflix: { category: "entertainment", domain: "netflix.com" },
  spotify: { category: "entertainment", domain: "spotify.com" },
  "apple": { category: "entertainment", domain: "apple.com" },
  "disney+": { category: "entertainment", domain: "disneyplus.com" },
  "disney plus": { category: "entertainment", domain: "disneyplus.com" },
  youtube: { category: "entertainment", domain: "youtube.com" },
  hbo: { category: "entertainment", domain: "hbomax.com" },
  amazon: { category: "shopping", domain: "amazon.com" },
  "amazon prime": { category: "shopping", domain: "amazon.com" },
  adobe: { category: "software", domain: "adobe.com" },
  microsoft: { category: "software", domain: "microsoft.com" },
  google: { category: "software", domain: "google.com" },
  dropbox: { category: "software", domain: "dropbox.com" },
  notion: { category: "software", domain: "notion.so" },
  slack: { category: "software", domain: "slack.com" },
  github: { category: "software", domain: "github.com" },
  openai: { category: "software", domain: "openai.com" },
  chatgpt: { category: "software", domain: "openai.com" },
  figma: { category: "software", domain: "figma.com" },
  canva: { category: "software", domain: "canva.com" },
  linkedin: { category: "software", domain: "linkedin.com" },
  "icloud": { category: "software", domain: "apple.com" },
  grammarly: { category: "software", domain: "grammarly.com" },
  nordvpn: { category: "software", domain: "nordvpn.com" },
  expressvpn: { category: "software", domain: "expressvpn.com" },
};

interface DetectedSub {
  name: string;
  price: number | null;
  billing_cycle: string;
  category: string;
  source_email: string;
  confidence: number;
}

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
  const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) return null;
  return res.json();
}

function extractPrice(text: string): number | null {
  const patterns = [
    /(?:€|EUR)\s*(\d+[.,]\d{2})/i,
    /(\d+[.,]\d{2})\s*(?:€|EUR)/i,
    /\$\s*(\d+[.,]\d{2})/i,
    /(\d+[.,]\d{2})\s*(?:USD|GBP|£)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseFloat(m[1].replace(",", "."));
  }
  return null;
}

function detectBillingCycle(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("annual") || lower.includes("yearly") || lower.includes("/year")) return "yearly";
  if (lower.includes("weekly") || lower.includes("/week")) return "weekly";
  return "monthly";
}

function identifyService(subject: string, from: string, snippet: string): string | null {
  const combined = `${subject} ${from} ${snippet}`.toLowerCase();
  for (const [key] of Object.entries(KNOWN_SERVICES)) {
    if (combined.includes(key)) return key;
  }
  return null;
}

function isSubscriptionEmail(subject: string, snippet: string): boolean {
  const combined = `${subject} ${snippet}`.toLowerCase();
  return SUBSCRIPTION_KEYWORDS.some((kw) => combined.includes(kw));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUser = createClient(SUPABASE_URL, authHeader.replace("Bearer ", ""));
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: { user } } = await supabaseUser.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get Gmail connection
    const { data: connection } = await supabaseAdmin
      .from("gmail_connections")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!connection) {
      return new Response(JSON.stringify({ error: "Gmail not connected" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let accessToken = connection.access_token;

    // Refresh token if expired
    if (new Date(connection.token_expires_at) <= new Date()) {
      const refreshed = await refreshAccessToken(connection.refresh_token);
      if (!refreshed) {
        return new Response(JSON.stringify({ error: "Token refresh failed" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      accessToken = refreshed.access_token;
      const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
      await supabaseAdmin.from("gmail_connections").update({
        access_token: accessToken,
        token_expires_at: newExpiry,
      }).eq("user_id", user.id);
    }

    // Search Gmail for subscription-related emails (last 90 days)
    const query = encodeURIComponent(
      "subject:(subscription OR renewal OR invoice OR receipt OR billing OR payment confirmation) newer_than:90d"
    );
    const gmailRes = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=50`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!gmailRes.ok) {
      const errText = await gmailRes.text();
      console.error("Gmail API error:", errText);
      return new Response(JSON.stringify({ error: "Gmail API error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gmailData = await gmailRes.json();
    const messageIds: string[] = (gmailData.messages || []).map((m: { id: string }) => m.id);

    const detected: DetectedSub[] = [];
    const seenServices = new Set<string>();

    // Fetch each message's metadata
    for (const msgId of messageIds.slice(0, 30)) {
      try {
        const msgRes = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${msgId}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!msgRes.ok) { await msgRes.text(); continue; }

        const msg = await msgRes.json();
        const headers = msg.payload?.headers || [];
        const subject = headers.find((h: { name: string }) => h.name === "Subject")?.value || "";
        const from = headers.find((h: { name: string }) => h.name === "From")?.value || "";
        const snippet = msg.snippet || "";

        if (!isSubscriptionEmail(subject, snippet)) continue;

        const serviceName = identifyService(subject, from, snippet);
        if (!serviceName || seenServices.has(serviceName)) continue;

        seenServices.add(serviceName);
        const serviceInfo = KNOWN_SERVICES[serviceName];
        const price = extractPrice(`${subject} ${snippet}`);
        const cycle = detectBillingCycle(`${subject} ${snippet}`);

        detected.push({
          name: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
          price,
          billing_cycle: cycle,
          category: serviceInfo?.category || "other",
          source_email: from,
          confidence: price ? 0.9 : 0.6,
        });
      } catch (e) {
        console.error("Error processing message:", e);
      }
    }

    // Update last_scan_at
    await supabaseAdmin.from("gmail_connections").update({
      last_scan_at: new Date().toISOString(),
    }).eq("user_id", user.id);

    return new Response(JSON.stringify({ detected, scanned: messageIds.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Scan error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
