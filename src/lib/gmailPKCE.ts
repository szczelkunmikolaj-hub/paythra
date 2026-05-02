// Client-side Google OAuth 2.0 with PKCE.
// Token exchange is performed by the `gmail-token-exchange` edge function
// so the client secret never reaches the browser.
import { supabase } from "@/integrations/supabase/client";

export const GOOGLE_CLIENT_ID =
  "240223060504-3vsrsk3i8plb86ih3oedh6jeg4t86d2r.apps.googleusercontent.com";
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

const SS_VERIFIER = "gmail_pkce_verifier";
// Tokens are kept in sessionStorage (not localStorage) so they're scoped
// to the current tab and not exposed to other tabs / browser extensions.
// One-time migration cleans up any tokens previously written to localStorage.
const LS_TOKEN_KEY = "gmail_access_token";
const LS_TOKEN_META = "gmail_token_meta"; // { expires_at }
const LS_EMAIL = "gmail_connected_email";

try {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_TOKEN_META);
    localStorage.removeItem(LS_EMAIL);
  }
} catch {
  /* ignore */
}

// --- PKCE helpers ---
function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(length = 64): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr);
}

async function sha256(input: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}

export function getRedirectUri(): string {
  return `${window.location.origin}/auth/callback`;
}

export async function startGmailAuth(): Promise<void> {
  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));
  sessionStorage.setItem(SS_VERIFIER, verifier);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: GMAIL_SCOPE,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "online",
    prompt: "consent",
    include_granted_scopes: "true",
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const verifier = sessionStorage.getItem(SS_VERIFIER);
  console.log(
    "[Gmail PKCE] Verifier from sessionStorage:",
    verifier ? `present (${verifier.length} chars)` : "MISSING"
  );
  if (!verifier) throw new Error("Missing PKCE verifier — please retry the connection.");

  const redirect_uri = getRedirectUri();
  console.log("[Gmail PKCE] Calling edge function gmail-token-exchange with:", {
    code: `${code.slice(0, 10)}…`,
    code_verifier: `${verifier.slice(0, 10)}… (${verifier.length} chars)`,
    redirect_uri,
  });

  const { data, error } = await supabase.functions.invoke("gmail-token-exchange", {
    body: { code, code_verifier: verifier, redirect_uri },
  });

  if (error) {
    console.error("[Gmail PKCE] Edge function error:", error);
    throw new Error(error.message || "Token exchange failed");
  }
  if (!data?.access_token) {
    console.error("[Gmail PKCE] Edge function returned no access_token:", data);
    throw new Error(data?.error || "Token exchange failed");
  }

  const accessToken: string = data.access_token;
  const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  sessionStorage.setItem(LS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(LS_TOKEN_META, JSON.stringify({ expires_at: expiresAt }));
  sessionStorage.removeItem(SS_VERIFIER);

  if (data.email) {
    sessionStorage.setItem(LS_EMAIL, data.email);
  }

  return accessToken;
}

/** Returns the access token if present and not expired, else null. */
export function getAccessToken(): string | null {
  const token = sessionStorage.getItem(LS_TOKEN_KEY);
  if (!token) return null;
  const metaRaw = sessionStorage.getItem(LS_TOKEN_META);
  if (metaRaw) {
    try {
      const meta = JSON.parse(metaRaw);
      if (meta.expires_at && meta.expires_at <= Date.now()) return null;
    } catch {
      /* ignore */
    }
  }
  return token;
}

export function isGmailConnected(): boolean {
  return getAccessToken() !== null;
}

export function getConnectedEmail(): string | null {
  return sessionStorage.getItem(LS_EMAIL);
}

export function disconnectGmail() {
  sessionStorage.removeItem(LS_TOKEN_KEY);
  sessionStorage.removeItem(LS_TOKEN_META);
  sessionStorage.removeItem(LS_EMAIL);
  sessionStorage.removeItem(SS_VERIFIER);
  // Clean up legacy localStorage entries from older versions
  try {
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_TOKEN_META);
    localStorage.removeItem(LS_EMAIL);
  } catch {
    /* ignore */
  }
}
