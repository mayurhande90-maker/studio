// lib/firebase.js
import app from '@/lib/firebase';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(app);


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// ✅ Explicitly force manual initialization (disable auto-init)
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase manually initialized with config:", firebaseConfig.projectId);
  } catch (err) {
    console.error("🔥 Firebase manual init failed:", err);
  }
} else {
  app = getApp();
}

// ✅ Export the initialized app for use everywhere
export default app;
