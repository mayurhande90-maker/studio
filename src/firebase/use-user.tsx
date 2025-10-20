
'use client';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  AuthProvider,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth } from './provider';

export const useUser = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return {
    user,
    auth,
    loading,
    signInWithProvider: (provider: AuthProvider) =>
      signInWithPopup(auth, provider),
    signOut: () => signOut(auth),
  };
};

