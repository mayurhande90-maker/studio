'use client';

import { useUser } from '@/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCredits } from '@/hooks/use-credits';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { credits, isLoading: isCreditsLoading } = useCredits();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // This should be handled by middleware or a higher-order component
    // in a real application, but for now, this is a simple check.
    return <div>Please log in to view the dashboard.</div>;
  }

  const getDisplayName = () => {
    if (user.displayName) {
      return user.displayName;
    }
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Capitalize first letter of each part of the name (if separated by '.')
      return emailName.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }
    return 'User';
  };
  
  const CreditsCardContent = () => {
    if (isCreditsLoading) {
        return <Skeleton className="h-10 w-24" />;
    }
    return (
        <>
            <div className="text-4xl font-bold">{credits ?? 0}</div>
            <p className="text-xs text-muted-foreground">Credits remaining this month</p>
             <Button asChild className="mt-4">
              <Link href="/#pricing">Buy More Credits</Link>
            </Button>
        </>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {getDisplayName()}!</h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your account and recent activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Your available credits for using AI tools.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreditsCardContent />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Creations</CardTitle>
            <CardDescription>View and manage your saved creations.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have no saved creations yet.</p>
             <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/creations">View Creations</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current subscription plan.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-xl font-semibold">Free Plan</div>
             <p className="text-xs text-muted-foreground">Upgrade to unlock more features.</p>
             <Button asChild variant="secondary" className="mt-4">
                <Link href="/#pricing">Upgrade Plan</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
