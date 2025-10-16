
'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/hooks/use-credits';
import { Skeleton } from '../ui/skeleton';
import { useUser } from '@/firebase/use-user';
import { cn } from '@/lib/utils';

export function Hero() {
  const { user, loading: isUserLoading } = useUser();
  const { credits, isLoading } = useCredits();

  const CreditsDisplay = () => {
    if (isLoading || isUserLoading) {
      return <Skeleton className="h-6 w-48 rounded-md" />;
    }

    if (!user) {
         return (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              You have {credits ?? 0} free credit to start — no card required.
            </p>
         )
    }

    return (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Start with 10 free credits upon sign-up.
        </p>
    )
  };

  return (
    <section id="home" className="relative w-full py-16 lg:py-20 overflow-hidden bg-background">
       <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="p-8 md:p-12 border border-border/50 rounded-lg bg-card/80 backdrop-blur-lg shadow-lg">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-gradient animated-gradient">
                Your Everyday AI Studio
              </h1>
              <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
                Enhance photos, remove backgrounds, colorize memories, and design creative visuals — all powered by Magicpixa.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="text-primary-foreground transition-transform hover:scale-105 rounded-2xl shadow-lg text-base py-6 px-8 font-semibold"
              >
                <Link href="/enhance">
                  Enhance Your First Photo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={cn("rounded-2xl py-6 px-8 font-bold text-primary-foreground bg-transparent btn-gradient-border")}>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
            <CreditsDisplay />
          </div>
        </div>
      </div>
    </section>
  );
}
