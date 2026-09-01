// Auth config + Google Identity Services helpers (client-side only).
//
// Uses Google Identity Services (GIS) so authentication works without a backend
// session server. On success, Google returns a signed JWT credential; we decode
// its public claims (name/email/picture) for display. The JWT is NOT trusted for
// authorization on a server — this is a client-side gate for content unlocking.

/** Number of topics available before sign-in is required. */
export const FREE_TOPIC_LIMIT = 10;

/** localStorage key for the persisted session. */
export const AUTH_STORAGE_KEY = 'devlearn.auth.user';

/**
 * Google OAuth client ID. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment
 * (.env). When unset, the sign-in UI still renders but explains configuration
 * is required, so the app never crashes in local/dev without a client ID.
 */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/** Whether Google sign-in is configured (a client ID is present). */
export const isGoogleConfigured = () => Boolean(GOOGLE_CLIENT_ID);

/** URL of the Google Identity Services script. */
export const GIS_SRC = 'https://accounts.google.com/gsi/client';

/**
 * Decode the payload of a Google ID token (JWT) without verifying its
 * signature. Safe for reading display claims client-side only.
 * @param {string} credential
 * @returns {null | { name: string, email: string, picture?: string, sub?: string }}
 */
export function decodeGoogleCredential(credential) {
  try {
    const [, payload] = credential.split('.');
    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json =
      typeof atob === 'function'
        ? decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
        : Buffer.from(base64, 'base64').toString('utf8');
    const claims = JSON.parse(json);
    if (!claims || !claims.email) return null;
    return {
      name: claims.name || claims.email,
      email: claims.email,
      picture: claims.picture,
      sub: claims.sub,
    };
  } catch {
    return null;
  }
}

/** Read the persisted user from localStorage (client only). */
export function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Persist (or clear when null) the user in localStorage. */
export function writeStoredUser(user) {
  try {
    if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* storage unavailable — session is memory-only this visit */
  }
}
