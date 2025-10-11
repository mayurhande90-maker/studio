'use client';

import Link from 'next/link';
import {
  Wand2,
  Palette,
  Sparkles,
  Scissors,
  ArrowRight,
  ScanLine,
  FileText,
  Book,
  Type,
  Youtube,
  Monitor,
  PartyPopper,
  Users,
  User,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const featureCategories = [
  {
    value: 'photo',
    title: 'AI Photo Enhancements',
    description: 'Perfect your photos with next-gen AI enhancement tools.',
    features: [
      {
        icon: Wand2,
        title: 'Magic Enhance',
        description:
          'Automatic color, tone, and lighting correction for stunning, professional-quality results.',
        href: '/enhance',
        buttonLabel: 'Try Now',
      },
      {
        icon: Scissors,
        title: 'Background Eraser',
        description:
          'Instantly remove any background and export high-resolution transparent PNGs.',
        href: '/background-remover',
        buttonLabel: 'Try Now',
      },
      {
        icon: Sparkles,
        title: 'AI Photo Studio',
        description:
          'Upload a raw product photo — get a cinematic, marketing-ready image that looks hyper-realistic.',
        href: '/photo-studio',
        buttonLabel: 'Try Now',
      },
      {
        icon: Palette,
        title: 'Vintage Colorizer',
        description:
          'Transform old black-and-white photos into lifelike, naturally colored images.',
        href: '/colorizer',
        buttonLabel: 'Try Now',
      },
    ],
  },
  {
    value: 'productivity',
    title: 'Productivity & Content Tools',
    description: 'Save hours of effort with smart automation.',
    features: [
      {
        icon: ScanLine,
        title: 'DocuScan Pro',
        description:
          'Scan, clean, and enhance physical documents for digital use.',
        href: '/doc-scanner',
        buttonLabel: 'Try Now',
      },
      {
        icon: FileText,
        title: 'PDF Master Suite',
        description:
          'Compress, summarize, translate, and extract text from PDFs — all in one place.',
        href: '/pdf-tools',
        buttonLabel: 'Try Now',
      },
      {
        icon: Book,
        title: 'Smart Notes Generator',
        description:
          'Upload textbook pages or PDFs to get summarized notes instantly.',
        href: '/notes-generator',
        buttonLabel: 'Try Now',
      },
      {
        icon: Type,
        title: 'AutoCaption AI',
        description:
          'Upload a photo or post and get ready-to-use captions with hashtags automatically.',
        href: '/caption-generator',
        buttonLabel: 'Try Now',
      },
    ],
  },
  {
    value: 'creative',
    title: 'Creative & Fun Studio',
    description:
      'Turn imagination into reality with these creative AI experiences.',
    features: [
      {
        icon: Youtube,
        title: 'Thumbnail Forge',
        description:
          'Design YouTube thumbnails in seconds with AI-driven templates and text styling.',
        href: '/thumbnail-creator',
        buttonLabel: 'Try Now',
      },
      {
        icon: Monitor,
        title: 'Mockup Maker',
        description:
          'Generate realistic mockups for products, devices, and packaging.',
        href: '/mockup-generator',
        buttonLabel: 'Try Now',
      },
      {
        icon: PartyPopper,
        title: 'Festive Post Generator',
        description:
          'Choose a festival, add your name or brand, and get a beautiful, ready-to-share post.',
        href: '/festive-post',
        buttonLabel: 'Try Now',
      },
      {
        icon: Users,
        title: 'Celebrity Collab AI',
        description:
          'Upload your photo and create a hyper-realistic picture with your favorite celebrity.',
        href: '/celebrity-photo',
        buttonLabel: 'Try Now',
      },
      {
        icon: User,
        title: 'FutureMe Vision',
        description:
          'See how you might look 10 years from now — cinematic or fantasy-style transformation.',
        href: '/future-self',
        buttonLabel: 'Try Now',
      },
    ],
  },
];

export function Features() {
  return (
    <section id="features" className="w-full py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <Badge
            variant="outline"
            className="text-sm font-medium bg-primary/10 text-primary border-primary/20 py-1 px-3"
          >
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient animated-gradient">
            Explore the Magic of AI
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            All-in-one creative tools to enhance, create, and reimagine your
            world.
          </p>
        </div>

        <Tabs defaultValue="photo" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto h-auto">
            <TabsTrigger value="photo" className="py-3 text-base">
              AI Photo Enhancements
            </TabsTrigger>
            <TabsTrigger value="productivity" className="py-3 text-base">
              Productivity & Content
            </TabsTrigger>
            <TabsTrigger value="creative" className="py-3 text-base">
              Creative & Fun
            </TabsTrigger>
          </TabsList>
          {featureCategories.map((category, catIndex) => (
            <TabsContent key={catIndex} value={category.value} className="mt-12">
              <div className="text-center mb-8">
                <p className="mt-2 text-muted-foreground md:text-lg">
                  {category.description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.features.map((feature, index) => (
                  <Card
                    key={index}
                    className="rounded-2xl shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 border-border/20 group bg-card/50 backdrop-blur-sm overflow-hidden"
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
                    <CardFooter className="p-6 pt-0">
                      <Button
                        asChild
                        variant="link"
                        className="p-0 h-auto font-semibold"
                      >
                        <Link href={feature.href}>
                          {feature.buttonLabel}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
