'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GoogleAuthProvider } from 'firebase/auth';

export default function SignupPage() {
  const { user, signInWithProvider, loading, auth } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithProvider(provider);
  };

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

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
            <CardDescription>You’re already signed up and logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} className="mt-4 w-full">
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
          <CardTitle>Create your MagicPixa account</CardTitle>
          <CardDescription>Sign up using your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full">
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
