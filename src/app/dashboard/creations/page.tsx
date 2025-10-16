'use client';

export const dynamic = 'force-dynamic'; // prevents Next.js from pre-rendering
export const revalidate = 0; // ensures it's only rendered client-side

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardCreations() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Creations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your creations dashboard. Display user data here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
