"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useUser } from "@/firebase/use-user";
import { firestore } from "@/firebase/client-config";

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
        await setDoc(ref, { credits: 10, email: user.email, displayName: user.displayName });
        setCredits(10);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching credits:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, userLoading]);

  const deductCredits = async (amount: number) => {
    if (!user) return;
    const ref = doc(firestore, "users", user.uid);
    const newBalance = (credits ?? 0) - amount;
    if (newBalance >= 0) {
      await updateDoc(ref, { credits: newBalance });
      setCredits(newBalance);
    } else {
      console.error("Cannot deduct credits, insufficient balance.");
    }
  };

  return { credits, isLoading, deductCredits };
}
