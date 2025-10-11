'use client';

import Link from 'next/link';
import { Wand2, Scissors, Image as ImageIcon, Paintbrush, ArrowRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '../ui/button';

const features = [
  {
    icon: Scissors,
    title: 'Background Remover',
    description: 'Automatically remove any background and get a clean, ready-to-use image.',
    href: '/background-remover',
  },
  {
    icon: Wand2,
    title: 'Enhance Like a Pro',
    description: 'Fix poor lighting, enhance colors, and bring out natural tones instantly.',
    href: '/enhance',
  },
  {
    icon: ImageIcon,
    title: 'AI Photo Studio',
    description: 'Upload raw product photos and turn them into studio-quality marketing images.',
    href: '/photo-studio',
  },
  {
    icon: Paintbrush,
    title: 'Colorize Old Photos',
    description: 'Turn your old black-and-white photos into colorful, lifelike images.',
    href: '/colorizer',
  },
];

export function Features() {
  return (
    <section id="features" className="w-full py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What You Can Do with Magicpixa
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            All your photo editing needs, powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-3xl shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 border-border/10 group"
            >
              <CardHeader className="p-8">
                <div className="p-4 bg-primary/10 rounded-xl mb-4 w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground pt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-8 pt-0">
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto font-semibold"
                >
                  <Link href={feature.href}>
                    Try {feature.title}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
