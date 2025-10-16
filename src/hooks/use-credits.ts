import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase/firestore";

const ANONYMOUS_CREDITS_KEY = "magicpixa_anonymous_credits";

export function useCredits() {
  const user = null;
  const isUserLoading = false;
  const firestore = useFirestore();

  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Temporary logic (since user is null)
  useEffect(() => {
    setCredits(0);
    setIsLoading(false);
  }, []);

  return {
    credits,
    isLoading,
    deductCredits: () => {},
  };
}
