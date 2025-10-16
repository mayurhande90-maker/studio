'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const { user, login, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="p-8">
          <CardHeader>
            <CardTitle>Welcome, {user.displayName}</CardTitle>
            <CardDescription>You are already logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={logout} className="mt-4 w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-8">
        <CardHeader>
          <CardTitle>Login to MagicPixa</CardTitle>
          <CardDescription>Continue with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
