// Client-side Google OAuth 2.0 with PKCE (no client secret required).
// VITE_GOOGLE_CLIENT_ID is a public OAuth client ID — safe to ship in the bundle.

export const GOOGLE_CLIENT_ID =
  "240223060504-87m6gplhtq4dbipvugpvkq0o23t1k6ce.apps.googleusercontent.com";
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

const LS_VERIFIER = "paythra_gmail_pkce_verifier";
const LS_TOKEN = "paythra_gmail_token";
const LS_EMAIL = "paythra_gmail_email";

export interface GmailToken {
  access_token: string;
  expires_at: number; // epoch ms
  refresh_token?: string;
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
  localStorage.setItem(LS_VERIFIER, verifier);

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

export async function exchangeCodeForToken(code: string): Promise<GmailToken> {
  const verifier = localStorage.getItem(LS_VERIFIER);
  if (!verifier) throw new Error("Missing PKCE verifier — please retry the connection.");

  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    code,
    code_verifier: verifier,
    grant_type: "authorization_code",
    redirect_uri: getRedirectUri(),
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Token exchange failed: ${errText}`);
  }

  const data = await res.json();
  const token: GmailToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
    refresh_token: data.refresh_token,
  };
  saveToken(token);
  localStorage.removeItem(LS_VERIFIER);

  // fetch email address for display
  try {
    const profile = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/profile",
      { headers: { Authorization: `Bearer ${token.access_token}` } }
    ).then((r) => r.json());
    if (profile.emailAddress) localStorage.setItem(LS_EMAIL, profile.emailAddress);
  } catch {
    /* non-fatal */
  }

  return token;
}

export function saveToken(token: GmailToken) {
  localStorage.setItem(LS_TOKEN, JSON.stringify(token));
}

export function loadToken(): GmailToken | null {
  const raw = localStorage.getItem(LS_TOKEN);
  if (!raw) return null;
  try {
    const t = JSON.parse(raw) as GmailToken;
    if (t.expires_at <= Date.now()) return null;
    return t;
  } catch {
    return null;
  }
}

export function getConnectedEmail(): string | null {
  return localStorage.getItem(LS_EMAIL);
}

export function disconnectGmail() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_EMAIL);
  localStorage.removeItem(LS_VERIFIER);
}
