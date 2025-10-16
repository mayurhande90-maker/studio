// This file is for client-side Firebase initialization.
// It's safe to expose this configuration to the browser.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-5028520146-48db9",
  appId: "1:321672599979:web:309245f44033b90e795aee",
  apiKey: "AIzaSyAlQlbEyetuldbl5q8fc7EDlGLX56hP6fo",
  authDomain: "studio-5028520146-48db9.firebaseapp.com",
  messagingSenderId: "321672599979"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
