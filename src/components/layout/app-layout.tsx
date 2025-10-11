'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <div className="relative flex min-h-dvh flex-col">
        <main className="flex-1">{children}</main>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="relative flex min-h-dvh flex-col pt-20">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
      <Toaster />
    </>
  );
}