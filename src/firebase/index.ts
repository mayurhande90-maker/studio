
'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
