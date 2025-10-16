
'use client';

import React from 'react';
import { Coins } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { UserDropdown } from '../auth/user-dropdown';
import { Skeleton } from '../ui/skeleton';
import { useCredits } from '@/hooks/use-credits';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { DashboardSidebar } from './dashboard-sidebar';
import { useUser } from '@/firebase/use-user';

export function DashboardHeader() {
  const { user, loading: isUserLoading } = useUser();
  const { credits, isLoading: isCreditsLoading } = useCredits();

  const CreditsDisplay = () => {
    if (isCreditsLoading || isUserLoading) {
      return <Skeleton className="h-10 w-32 rounded-full" />;
    }
    return (
      <Button variant="outline" className="rounded-full font-bold text-base">
        <Coins className="w-5 h-5 text-yellow-500 animate-pulse" />
        <span className="ml-2">{credits ?? 0}</span>
      </Button>
    );
  };

  const AuthNav = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    return <UserDropdown />;
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 md:px-6">
       <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className='rounded-full'>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <CreditsDisplay />
        <ThemeToggle />
        <AuthNav />
      </div>
    </header>
  );
}
