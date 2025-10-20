
'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './client-config';
import { useUser } from './use-user';
import { 
    FirebaseProvider, 
    useFirebase,
    useFirebaseApp,
    useAuth,
    useFirestore,
} from './provider';
import { FirebaseClientProvider } from './client-provider';


function initializeFirebase() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export { 
    initializeFirebase,
    FirebaseProvider,
    FirebaseClientProvider,
    useUser,
    useFirebase,
    useFirebaseApp,
    useAuth,
    useFirestore
};
