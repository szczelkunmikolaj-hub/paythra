// Client-side Google OAuth 2.0 with PKCE (no client secret).
// Public client ID — safe to ship in the bundle.

export const GOOGLE_CLIENT_ID =
  "240223060504-87m6gplhtq4dbipvugpvkq0o23t1k6ce.apps.googleusercontent.com";
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

const SS_VERIFIER = "gmail_pkce_verifier";
const LS_TOKEN_KEY = "gmail_access_token";
const LS_TOKEN_META = "gmail_token_meta"; // { expires_at }
const LS_EMAIL = "gmail_connected_email";

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
  console.log("[Gmail PKCE] Verifier from sessionStorage:", verifier ? `present (${verifier.length} chars)` : "MISSING");
  if (!verifier) throw new Error("Missing PKCE verifier — please retry the connection.");

  // PKCE-only token exchange — NO client_secret field.
  const params: Record<string, string> = {
    client_id: GOOGLE_CLIENT_ID,
    code,
    code_verifier: verifier,
    grant_type: "authorization_code",
    redirect_uri: getRedirectUri(),
  };

  console.log("[Gmail PKCE] Token exchange params:", {
    client_id: params.client_id,
    code: `${code.slice(0, 10)}…`,
    code_verifier: `${verifier.slice(0, 10)}… (${verifier.length} chars)`,
    grant_type: params.grant_type,
    redirect_uri: params.redirect_uri,
    has_client_secret: false,
  });

  const body = new URLSearchParams(params);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Gmail PKCE] Token exchange failed:", res.status, errText);
    throw new Error(`Token exchange failed: ${errText}`);
  }

  const data = await res.json();
  const accessToken: string = data.access_token;
  const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  localStorage.setItem(LS_TOKEN_KEY, accessToken);
  localStorage.setItem(LS_TOKEN_META, JSON.stringify({ expires_at: expiresAt }));
  sessionStorage.removeItem(SS_VERIFIER);

  // fetch email for display (non-fatal)
  try {
    const profile = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/profile",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ).then((r) => r.json());
    if (profile.emailAddress) localStorage.setItem(LS_EMAIL, profile.emailAddress);
  } catch {
    /* non-fatal */
  }

  return accessToken;
}

/** Returns the access token if present and not expired, else null. */
export function getAccessToken(): string | null {
  const token = localStorage.getItem(LS_TOKEN_KEY);
  if (!token) return null;
  const metaRaw = localStorage.getItem(LS_TOKEN_META);
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
  return localStorage.getItem(LS_EMAIL);
}

export function disconnectGmail() {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_TOKEN_META);
  localStorage.removeItem(LS_EMAIL);
  sessionStorage.removeItem(SS_VERIFIER);
}
