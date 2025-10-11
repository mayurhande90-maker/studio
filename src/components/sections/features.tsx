'use client';

import Link from 'next/link';
import {
  Wand2, Palette, Sparkles, Scissors, ScanLine, FileText, Book, Type, Youtube, Monitor, PartyPopper, Users, User, ArrowRight, BrainCircuit, CreditCard, Bot
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const features = [
  { icon: Wand2, title: "Photo Enhancement", description: "Fix lighting & sharpen details instantly.", href: "/enhance" },
  { icon: Scissors, title: "Background Removal", description: "Transparent PNGs in seconds.", href: "/background-remover" },
  { icon: Sparkles, title: "Photo Studio", description: "Turn raw product shots into cinematic ads.", href: "/photo-studio" },
  { icon: Palette, title: "Photo Colourize", description: "Revive vintage photos in color.", href: "/colorizer" },
  { icon: Youtube, title: "YouTube Thumbnail Creator", description: "Catchy thumbnails in seconds.", href: "/thumbnail-creator" },
  { icon: Type, title: "Auto Captions + Hashtags", description: "Perfect caption generator.", href: "/caption-generator" },
  { icon: ScanLine, title: "Document Scanner + Enhancer", description: "Scan & clean docs.", href: "/doc-scanner" },
  { icon: FileText, title: "PDF Tools", description: "Compress, summarize, translate, extract.", href: "/pdf-tools" },
  { icon: Book, title: "Notes Generator", description: "Textbook → summarized notes.", href: "/notes-generator" },
  { icon: Monitor, title: "Ad Creative Generator", description: "Product → ready ad poster.", href: "#" },
  { icon: BrainCircuit, title: "Brand Guidelines Generator", description: "Upload logo → full style guide.", href: "#" },
  { icon: Monitor, title: "Mockup Generator", description: "Visualize products on objects.", href: "/mockup-generator" },
  { icon: Bot, title: "Post Scheduler", description: "Plan & auto-post content.", href: "#" },
  { icon: Sparkles, title: "AI Time Capsule", description: "Store memories for future.", href: "#" },
  { icon: PartyPopper, title: "Festive Post Generator", description: "Personalized festival greetings.", href: "/festive-post" },
  { icon: CreditCard, title: "House Budget Simplifier", description: "Auto expense visualizer.", href: "#" },
  { icon: Users, title: "Picture with Celebrity", description: "Blend with famous personalities.", href: "/celebrity-photo" },
  { icon: Sparkles, title: "Memory Scene", description: "Recreate childhood places today.", href: "#" },
  { icon: User, title: "AI Future Self", description: "See yourself 10 years ahead.", href: "/future-self" },
  { icon: ScanLine, title: "AI Bill Reader", description: "Scan bills → breakdown + savings tips.", href: "#" },
];


export function Features() {
  return (
    <section id="features" className="w-full py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <Badge
            variant="outline"
            className="text-sm font-medium bg-primary/10 text-primary border-primary/20 py-1 px-3"
          >
            What You Can Do
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient animated-gradient">
            Explore Our AI Features
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            All-in-one creative tools to enhance, create, and reimagine your world.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-3xl shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 border-border/10 group bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col"
            >
              <CardHeader className="p-6">
                <div className="p-3 bg-primary/10 rounded-xl mb-4 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground pt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-6 pt-0 mt-auto">
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto font-semibold text-sm"
                >
                  <Link href={feature.href}>
                    Try Now
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
