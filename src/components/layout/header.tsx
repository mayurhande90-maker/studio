
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Coins } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '../theme-toggle';
import { UserDropdown } from '../auth/user-dropdown';
import { Skeleton } from '../ui/skeleton';
import { useCredits } from '@/hooks/use-credits';
import { useUser } from '@/firebase/use-user';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'About', href: '/about' },
];

const authNavItems = [
  { name: 'Login', href: '/login', variant: 'ghost' as const },
  { name: 'Sign Up', href: '/signup', variant: 'gradient' as const },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading: isUserLoading } = useUser();
  const { credits, isLoading: isCreditsLoading } = useCredits();


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const CreditsDisplay = () => {
    if (isCreditsLoading) {
      return <Skeleton className="h-8 w-20 rounded-md" />;
    }
    return (
      <div className="flex items-center gap-2 font-bold text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-xl">
        <Coins className="w-5 h-5 text-primary"/>
        <span>{credits ?? 0} Credits</span>
      </div>
    );
  };

  const AuthNav = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-24 rounded-xl" />;
    }
    if (user) {
      return (
        <div className="flex items-center gap-2">
          <Button asChild variant="gradient" size="sm" className="font-bold">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <UserDropdown />
        </div>
      );
    }
    return (
      <div className="hidden md:flex items-center gap-2">
        {authNavItems.map((item) => (
          <Button
            key={item.name}
            asChild
            variant={item.variant}
            size="sm"
            className="font-bold"
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user && <CreditsDisplay />}
          <AuthNav />
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-8">
                    <Logo />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-lg font-bold text-foreground/80 hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="text-lg font-bold text-foreground/80 hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Button
                          onClick={() => {
                            // TODO: Implement Logout
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      authNavItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-lg font-bold text-foreground/80 hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
