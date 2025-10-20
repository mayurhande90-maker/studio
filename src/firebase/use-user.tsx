
'use client';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  AuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
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

  const createUserWithEmail = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        // Manually update the user state to reflect the new display name
        setUser({ ...userCredential.user, displayName });
    }
    return userCredential;
  }

  const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  return {
    user,
    auth,
    loading,
    createUserWithEmail,
    signInWithEmail,
    signOut: () => signOut(auth),
  };
};
