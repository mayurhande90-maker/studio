'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (isAuthPage) {
    return (
      <div className="relative flex min-h-dvh flex-col">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <div className={cn("relative flex min-h-dvh flex-col")}>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={cn("relative flex min-h-dvh flex-col", "pt-20")}>
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
