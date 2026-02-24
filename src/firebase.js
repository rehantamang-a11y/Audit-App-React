import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

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
  console.warn('Firebase config missing — auth and sync features disabled.');
  auth = null;
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth };

export async function signIn(email, password) {
  if (!auth) throw new Error('Firebase not configured');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  if (!auth) return;
  return firebaseSignOut(auth);
}

export function subscribeToAuthState(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
