import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { AppProviders } from '@/components/layout/app-providers';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'Magicpixa – AI Photo & Design Studio',
  description:
    'Enhance photos, remove backgrounds, colorize memories, and design creative visuals — all powered by Magicpixa.',
  openGraph: {
    title: 'Magicpixa – AI Photo & Design Studio',
    description:
      'Enhance photos, remove backgrounds, colorize memories, and design creative visuals — all powered by Magicpixa.',
    type: 'website',
    locale: 'en_US',
    url: 'https://magicpixa.com',
    siteName: 'Magicpixa',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased')}
        suppressHydrationWarning={true}
      >
        <AppProviders>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
