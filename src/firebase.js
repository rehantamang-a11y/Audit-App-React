import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const configMissing = !process.env.REACT_APP_FIREBASE_API_KEY;

let app, auth;

if (configMissing) {
  console.warn('Firebase config missing — sync features disabled. Add .env vars to enable.');
  auth = null;
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth };

export async function initAuth() {
  if (!auth) return; // No-op if config missing
  try {
    await signInAnonymously(auth);
  } catch (err) {
    console.error('Firebase anonymous auth failed:', err);
  }
}
