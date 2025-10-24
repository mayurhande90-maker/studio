
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { Toaster } from '../ui/toaster';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');


  if (isDashboard) {
    return (
      <div className={cn("relative flex min-h-dvh flex-col")}>
        <main className="flex-1">{children}</main>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={cn("relative flex min-h-dvh flex-col", !isAuthPage && "pt-20")}>
        <main className="flex-1">{children}</main>
      </div>
      {!isAuthPage && <Footer />}
      <Toaster />
    </>
  );
}
