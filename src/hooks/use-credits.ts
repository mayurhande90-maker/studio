"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export function useCredits() {
  const { user, loading: userLoading } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !user) return;

    const fetchCredits = async () => {
      const ref = doc(firestore, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCredits(snap.data().credits || 0);
      } else {
        setCredits(0);
      }
      setIsLoading(false);
    };

    fetchCredits();
  }, [user, userLoading]);

  const deductCredits = async (amount: number) => {
    if (!user) return;
    const ref = doc(firestore, "users", user.uid);
    const newBalance = (credits ?? 0) - amount;
    await updateDoc(ref, { credits: newBalance });
    setCredits(newBalance);
  };

  return { credits, isLoading, deductCredits };
}
