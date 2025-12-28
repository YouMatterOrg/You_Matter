// firebase-client.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWRLEiEmgcG7cvShqSvuePlx8Jw-s2MTg",
  authDomain: "youmatter-46c43.firebaseapp.com",
  projectId: "youmatter-46c43",
  storageBucket: "youmatter-46c43.firebasestorage.app",
  messagingSenderId: "971089399934",
  appId: "1:971089399934:web:2d8e0a2988b1938f46082f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { serverTimestamp };

// Wait until Firebase Auth is actually ready
function authReady() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

// Ensure you have a user before doing Firestore writes
export async function ensureAnonAuth() {
  // Persistence helps avoid “works then breaks on refresh”
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    // If running on file:// this can fail — we still proceed.
  }

  let user = await authReady();
  if (!user) {
    await signInAnonymously(auth);
    user = await authReady();
  }
  return user;
}

// Nice error messages for the UI (instead of alert popups)
export function friendlyFirebaseError(err) {
  const msg = String(err?.message || "");
  if (msg.includes("permission") || msg.includes("insufficient")) {
    return "Posting is blocked by Firestore rules (permission denied).";
  }
  if (msg.includes("auth") || msg.includes("unauth")) {
    return "Authentication failed. Please refresh and try again.";
  }
  if (msg.includes("network")) {
    return "Network error. Check your connection and try again.";
  }
  return "Could not create post. Please try again.";
}
