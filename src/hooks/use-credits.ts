
"use client";
import { useState, useEffect } from "react";
import { doc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useUser } from "@/firebase/use-user";
import { useFirestore } from "@/firebase";
import { errorEmitter, FirestorePermissionError } from "@/firebase/error-emitter";

export function useCredits() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      setIsLoading(true);
      return;
    }
    if (!user) {
      setIsLoading(false);
      setCredits(10); // Give 10 free credits for guests
      return;
    }

    if (!firestore) {
        setIsLoading(false);
        return;
    }

    const ref = doc(firestore, "users", user.uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setCredits(snap.data().credits ?? 0);
      } else {
        // If the user document doesn't exist, create it with initial credits.
        const newUserDoc = { credits: 10, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
        setDoc(ref, newUserDoc).catch((e: any) => {
           if (e.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: ref.path,
                operation: 'create',
                requestResourceData: newUserDoc
            });
            errorEmitter.emit('permission-error', permissionError);
          } else {
            console.error("Error creating user document:", e);
          }
        });
      }
      setIsLoading(false);
    }, (error) => {
        if (error.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
              path: ref.path,
              operation: 'get'
          });
          errorEmitter.emit('permission-error', permissionError);
        } else {
          console.error("Error fetching credits:", error);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, userLoading, firestore]);

  const deductCredits = async (amount: number) => {
    if (!user || !firestore) return;
    const ref = doc(firestore, "users", user.uid);
    const newBalance = (credits ?? 0) - amount;

    if (newBalance >= 0) {
      const updatedData = { credits: newBalance };
      updateDoc(ref, updatedData).catch((e: any) => {
        if (e.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: ref.path,
                operation: 'update',
                requestResourceData: updatedData
            });
          errorEmitter.emit('permission-error', permissionError);
        } else {
          console.error("Error deducting credits:", e);
        }
      });
    } else {
      console.error("Cannot deduct credits, insufficient balance.");
    }
  };

  return { credits, isLoading, deductCredits };
}
