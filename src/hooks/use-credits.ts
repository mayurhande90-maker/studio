"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useUser } from "@/firebase/use-user";
import { firestore } from "@/firebase/client-config";
import { errorEmitter, FirestorePermissionError } from "@/lib/error-emitter";

export function useCredits() {
  const { user, loading: userLoading } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      setIsLoading(true);
      return;
    }
    if (!user) {
      setIsLoading(false);
      setCredits(0);
      return;
    }

    const ref = doc(firestore, "users", user.uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setCredits(snap.data().credits ?? 0);
      } else {
        // If the user document doesn't exist, create it with initial credits.
        const newUserDoc = { credits: 10, email: user.email, displayName: user.displayName };
        try {
          await setDoc(ref, newUserDoc);
          setCredits(10);
        } catch (e: any) {
           if (e.code === 'permission-denied') {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError(
                e.message,
                'add',
                ref,
                newUserDoc
              )
            );
          } else {
            console.error("Error creating user document:", e);
          }
        }
      }
      setIsLoading(false);
    }, (error) => {
        if (error.code === 'permission-denied') {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError(
              error.message,
              'get',
              ref
            )
          );
        } else {
          console.error("Error fetching credits:", error);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, userLoading]);

  const deductCredits = async (amount: number) => {
    if (!user) return;
    const ref = doc(firestore, "users", user.uid);
    const newBalance = (credits ?? 0) - amount;

    if (newBalance >= 0) {
      const updatedData = { credits: newBalance };
      try {
        await updateDoc(ref, updatedData);
        setCredits(newBalance);
      } catch (e: any) {
        if (e.code === 'permission-denied') {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError(
              e.message,
              'update',
              ref,
              updatedData
            )
          );
        } else {
          console.error("Error deducting credits:", e);
        }
      }
    } else {
      console.error("Cannot deduct credits, insufficient balance.");
    }
  };

  return { credits, isLoading, deductCredits };
}
