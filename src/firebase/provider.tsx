
'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

export const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export interface FirebaseProviderProps {
  children: React.ReactNode;
  value: FirebaseContextValue;
}

export function FirebaseProvider({ children, value }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
}


export function useFirebaseApp() {
    const context = useFirebase();
    if (context.app === null) {
        throw new Error('Firebase app not available.');
    }
    return context.app;
}

export function useAuth() {
    const context = useFirebase();
    if (context.auth === null) {
        throw new Error('Firebase Auth not available.');
    }
    return context.auth;
}

export function useFirestore() {
    const context = useFirebase();
    if (context.firestore === null) {
        throw new Error('Firestore not available.');
    }
    return context.firestore;
}
