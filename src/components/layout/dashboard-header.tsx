'use client';

import React from 'react';
import { Coins } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { useUser } from '@/firebase';
import { UserDropdown } from '../auth/user-dropdown';
import { Skeleton } from '../ui/skeleton';
import { useCredits } from '@/hooks/use-credits';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { DashboardSidebar } from './dashboard-sidebar';

export function DashboardHeader() {
  const { isUserLoading } = useUser();
  const { credits, isLoading: isCreditsLoading } = useCredits();

  const CreditsDisplay = () => {
    if (isCreditsLoading || isUserLoading) {
      return <Skeleton className="h-8 w-24 rounded-md" />;
    }
    return (
      <div className="flex items-center gap-2 font-bold text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md">
        <Coins className="w-5 h-5 text-primary" />
        <span>{credits ?? 0} Credits</span>
      </div>
    );
  };

  const AuthNav = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    return <UserDropdown />;
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
       <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
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
