import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase Console > Project Settings > General > Your apps > Web app
// Bu bilgileri Firebase Console'dan kopyalayın
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "yesim-ozgen-web.firebaseapp.com",
  projectId: "yesim-ozgen-web",
  storageBucket: "yesim-ozgen-web.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'europe-west1');

export default app;
