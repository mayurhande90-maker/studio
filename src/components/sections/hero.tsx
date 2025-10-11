'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Hero() {
  return (
    <section id="home" className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="p-8 md:p-12 border border-border/50 rounded-lg bg-card shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-start space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-gradient animated-gradient">
                  Your Everyday AI Studio
                </h1>
                <p className="max-w-xl text-muted-foreground md:text-xl">
                  Enhance photos, remove backgrounds, colorize memories, and design creative visuals — all powered by Magicpixa.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 rounded-md shadow-lg text-base py-6 px-8 font-semibold"
                >
                  <Link href="/enhance">
                    Enhance Your First Photo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-md py-6 px-8">
                    <Link href="#features">Explore Features</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Start with 10 free credits — no card required.
              </p>
            </div>
            <div className="relative h-64 md:h-full w-full rounded-lg overflow-hidden">
               <Image 
                src="https://picsum.photos/seed/ai-studio/800/600" 
                alt="AI Photo Studio"
                fill
                className="object-cover"
                data-ai-hint="abstract technology"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
