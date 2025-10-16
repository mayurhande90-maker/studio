'use client';
import { createContext } from 'react';

import { app, auth, firestore } from './client-config';

export const FirebaseContext = createContext({
  app,
  auth,
  firestore,
});

export const FirebaseClientProvider = (props: { children: React.ReactNode }) => {
  return (
    <FirebaseContext.Provider
      value={{
        app,
        auth,
        firestore,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
