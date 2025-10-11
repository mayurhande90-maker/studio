'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section id="home" className="w-full relative overflow-hidden h-[90vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-background -z-10" />
      <div
        className="absolute inset-0 bg-radial-gradient -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.1), transparent)',
        }}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-gradient animated-gradient">
              Magicpixa
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
              Your Everyday AI Studio — Create. Enhance. Imagine.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 rounded-2xl shadow-lg text-lg py-7 px-8 font-semibold"
            >
              <Link href="/enhance">
                Start Creating Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="link" size="lg">
                <Link href="#pricing">View Plans</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Get 10 free credits upon signup.
          </p>
        </div>
      </div>
    </section>
  );
}
