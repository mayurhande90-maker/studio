'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
    // other fields from your user document
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
      
      if (user && userDocRef && firestore) {
        const updatedData = { credits: newCredits };
        setDoc(userDocRef, updatedData, { merge: true })
          .then(() => {
             setCredits(newCredits); // Optimistically update state on success
          })
          .catch((error) => {
            console.error("Failed to deduct credits:", error);
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      } else if (!user) {
         setCredits(newCredits);
        try {
          localStorage.setItem(ANONYMOUS_CREDITS_KEY, newCredits.toString());
        } catch (error) {
           console.error('Failed to update localStorage credits:', error);
        }
      }
    },
    [credits, user, userDocRef, firestore]
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
      setCredits(userDoc.credits);
      setIsLoading(false);
    } else if (user && !isUserDocLoading && !userDoc) {
       // New user doc might not be available immediately after signup
       // For now, let's be optimistic and assume new users get credits on doc creation.
       // The signup flow handles the initial creation.
       // We can provide a fallback or listen differently if needed.
       setIsLoading(false); // Assume loading is done, even if doc is not there yet.
    }

  }, [user, isUserLoading, handleAnonymousCredits, isUserDocLoading, userDoc]);

  return { credits, isLoading, deductCredits };
}
