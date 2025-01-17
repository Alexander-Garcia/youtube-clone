import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/**
 * Signs user in with Google popup
 * @returns A promise that resolves with users credentials
 */
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

/**
 * Signs user out
 */
export const signOut = () => {
  return auth.signOut();
};

/**
 * Subscribes to auth state changes
 * @param callback - A callback function to be called with the current user
 */
export const onAuthStateChangedHelper = (
  callback: (user: User | null) => void,
) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, provider };
