'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

const ANONYMOUS_CREDITS_KEY = 'magicpixa_anonymous_credits';

export function useCredits() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userDocRef = useMemoFirebase(() => {
    if (firestore && user) {
      return doc(firestore, 'users', user.uid);
    }
    return null;
  }, [firestore, user]);

  const { data: userDoc, isLoading: isUserDocLoading } = useDoc<{
    credits: number;
    lastCreditRenewal: { seconds: number };
    creationDate: { seconds: number };
  }>(userDocRef);
  
  const handleAnonymousCredits = useCallback(() => {
    try {
      const storedCredits = localStorage.getItem(ANONYMOUS_CREDITS_KEY);
      if (storedCredits === null) {
        // First-time anonymous user
        localStorage.setItem(ANONYMOUS_CREDITS_KEY, '1');
        setCredits(1);
      } else {
        setCredits(parseInt(storedCredits, 10));
      }
    } catch (error) {
      console.error('Failed to access localStorage for credits:', error);
      setCredits(0);
    }
    setIsLoading(false);
  }, []);

  const deductCredits = useCallback(
    (amount: number) => {
      if (credits === null) return;

      const newCredits = Math.max(0, credits - amount);
      setCredits(newCredits);

      if (user && userDocRef) {
        setDoc(userDocRef, { credits: newCredits }, { merge: true });
      } else {
        try {
          localStorage.setItem(ANONYMOUS_CREDITS_KEY, newCredits.toString());
        } catch (error) {
           console.error('Failed to update localStorage credits:', error);
        }
      }
    },
    [credits, user, userDocRef]
  );
  
  useEffect(() => {
    if (isUserLoading) {
      setIsLoading(true);
      return;
    }

    if (!user) {
      handleAnonymousCredits();
      return;
    }

    // User is authenticated
    if (isUserDocLoading) {
      setIsLoading(true);
      return;
    }
    
    if (userDoc) {
      const now = new Date();
      const lastRenewal = new Date(userDoc.lastCreditRenewal.seconds * 1000);
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      
      if (now.getTime() - lastRenewal.getTime() > thirtyDays) {
        // Time to renew credits
        const newCreditData = {
          credits: 10,
          lastCreditRenewal: serverTimestamp(),
        };
        setDoc(userDocRef, newCreditData, { merge: true });
        setCredits(10);
      } else {
        setCredits(userDoc.credits);
      }
      setIsLoading(false);
    } else if (user && !isUserDocLoading && !userDoc) {
       // New user, create their document
       const getDisplayName = () => {
          if (user.displayName) return user.displayName;
          if (user.email) return user.email.split('@')[0];
          return "User";
       };
       const newUserDoc = {
          id: user.uid,
          email: user.email,
          displayName: getDisplayName(),
          creationDate: serverTimestamp(),
          lastCreditRenewal: serverTimestamp(),
          credits: 10,
       };
       setDoc(userDocRef, newUserDoc).then(() => {
          setCredits(10);
          setIsLoading(false);
       });
    }

  }, [user, isUserLoading, handleAnonymousCredits, isUserDocLoading, userDoc, userDocRef]);

  return { credits, isLoading, deductCredits };
}
