
'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { FirebaseErrorListener } from '../FirebaseErrorListener';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <FirebaseErrorListener />
        {children}
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}
