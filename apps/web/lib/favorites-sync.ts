'use client';

import {
  FIRESTORE_DATABASE_ID,
  USER_SAVED_DOC,
  type FirebaseClientConfig,
} from './firebase';

// Cross-device sync for saved temples, backed by Firebase Anonymous Auth +
// Firestore. Isolated behind this small interface so the favorites hook stays
// unaware of Firebase, and so the whole SDK is code-split: `createFavoritesSync`
// dynamically imports firebase only when a project is actually configured,
// keeping it off the critical path of the performance-budgeted PWA.

export interface FavoritesSync {
  /** Current saved ids from the user's Firestore doc (empty if none yet). */
  readOnce(): Promise<string[]>;
  /** Replace the user's saved ids in Firestore. */
  write(ids: string[]): Promise<void>;
  /** Listen for remote changes; returns an unsubscribe function. */
  subscribe(onChange: (ids: string[]) => void): () => void;
  /** Release the auth listener (the Firebase app itself is cached/reused). */
  dispose(): void;
}

// A saved-temples Firestore doc: `{ savedTemples: string[], updatedAt }`.
function idsFromSnap(data: unknown): string[] {
  const saved = (data as { savedTemples?: unknown } | undefined)?.savedTemples;
  return Array.isArray(saved) ? saved.filter((x) => typeof x === 'string') : [];
}

export async function createFavoritesSync(
  config: FirebaseClientConfig,
): Promise<FavoritesSync> {
  const [{ initializeApp, getApps, getApp }, authMod, firestoreMod] =
    await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);

  const app = getApps().length ? getApp() : initializeApp(config);

  const auth = authMod.getAuth(app);
  const db = firestoreMod.getFirestore(app, FIRESTORE_DATABASE_ID);

  // Ensure an anonymous session, then resolve the uid.
  const uid = await new Promise<string>((resolve, reject) => {
    const stop = authMod.onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          stop();
          resolve(user.uid);
        }
      },
      reject,
    );
    authMod.signInAnonymously(auth).catch(reject);
  });

  const ref = firestoreMod.doc(db, USER_SAVED_DOC(uid));

  return {
    async readOnce() {
      const snap = await firestoreMod.getDoc(ref);
      return snap.exists() ? idsFromSnap(snap.data()) : [];
    },
    async write(ids) {
      await firestoreMod.setDoc(
        ref,
        { savedTemples: ids, updatedAt: firestoreMod.serverTimestamp() },
        { merge: true },
      );
    },
    subscribe(onChange) {
      return firestoreMod.onSnapshot(ref, (snap) => {
        onChange(snap.exists() ? idsFromSnap(snap.data()) : []);
      });
    },
    dispose() {
      // Nothing to tear down beyond the caller's subscribe() unsubscribe; the
      // Firebase app instance is intentionally kept for reuse across mounts.
    },
  };
}
