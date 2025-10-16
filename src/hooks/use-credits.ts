import { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase safely
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const ANONYMOUS_CREDITS_KEY = "magicpixa_anonymous_credits";

export function useCredits() {
  const user = null;
  const isUserLoading = false;

  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For now, simulate loading credits
  useEffect(() => {
    setCredits(0);
    setIsLoading(false);
  }, []);

  return {
    credits,
    isLoading,
    deductCredits: () => {
      console.log("Credits deducted (mock)");
    },
  };
}
