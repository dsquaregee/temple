'use client';

// Firebase client configuration, read from public build-time env vars. The web
// app is a static export served from the CDN (D1), so config travels as
// NEXT_PUBLIC_* values baked into the client bundle — the standard, safe way to
// ship Firebase web config (these keys identify the project; security is
// enforced by Firestore rules, not secrecy).
//
// Returns null when the project isn't configured. Every caller treats null as
// "no cross-device sync" and falls back to on-device storage, so the app runs
// fully without any Firebase setup (local dev, previews, tests).

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
}

// Firestore database id (D1: a named database `temple` in asia-south1, per
// firebase.json). The default database is unused.
export const FIRESTORE_DATABASE_ID = 'temple';

// The single Firestore document that holds a user's saved-temple ids.
export const USER_SAVED_DOC = (uid: string) => `users/${uid}`;

export function firebaseConfig(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const authDomain =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    (projectId ? `${projectId}.firebaseapp.com` : undefined);

  if (!apiKey || !projectId || !appId || !authDomain) return null;
  return { apiKey, authDomain, projectId, appId };
}
