
'use client';
import { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export const FirebaseClientProvider = (props: { children: React.ReactNode }) => {
  const value = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider value={value}>
      {props.children}
    </FirebaseProvider>
  );
};
