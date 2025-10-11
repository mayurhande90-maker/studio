'use client';

import Link from 'next/link';
import {
  Wand2,
  Scissors,
  Image as ImageIcon,
  Paintbrush,
  ArrowRight,
  ScanLine,
  FileText,
  Notebook,
  MessageSquare,
  Mic,
  Video,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const featureCategories = [
  {
    category: 'photo',
    title: 'AI Photo Enhancements',
    subtitle: 'Enhance and perfect your photos in seconds.',
    features: [
      {
        icon: Wand2,
        title: 'Magic Enhance',
        description: 'Auto color & lighting correction',
        href: '/enhance',
        comingSoon: false,
      },
      {
        icon: Scissors,
        title: 'Background Eraser',
        description: 'Remove background, export PNG',
        href: '/background-remover',
        comingSoon: false,
      },
      {
        icon: ImageIcon,
        title: 'AI Photo Studio',
        description: 'Turn raw product photo into cinematic marketing photo',
        href: '/photo-studio',
        comingSoon: false,
      },
      {
        icon: Paintbrush,
        title: 'Vintage Colorizer',
        description: 'Bring old black-and-white photos to life',
        href: '/colorizer',
        comingSoon: false,
      },
    ],
  },
  {
    category: 'productivity',
    title: 'Productivity & Content Tools',
    subtitle: 'Automate your daily workflow with smart AI tools.',
    features: [
      {
        icon: ScanLine,
        title: 'DocuScan Pro',
        description: 'Scan & enhance physical documents',
        href: '/doc-scanner',
        comingSoon: false,
      },
      {
        icon: FileText,
        title: 'PDF Master Suite',
        description: 'Compress, summarize, translate PDFs',
        href: '/pdf-tools',
        comingSoon: false,
      },
      {
        icon: Notebook,
        title: 'Smart Notes Generator',
        description: 'Convert textbook pages into summarized notes',
        href: '/notes-generator',
        comingSoon: false,
      },
      {
        icon: MessageSquare,
        title: 'AutoCaption AI',
        description: 'Generate captions & hashtags from your uploads',
        href: '/caption-generator',
        comingSoon: false,
      },
    ],
  },
  {
    category: 'creative',
    title: 'Creative & Fun Studio',
    subtitle: 'Create, imagine, and design with AI magic.',
    features: [
      {
        icon: ImageIcon,
        title: 'Thumbnail Forge',
        description: 'Create YouTube thumbnails instantly',
        href: '/thumbnail-creator',
        comingSoon: false,
      },
      {
        icon: ImageIcon,
        title: 'Mockup Maker',
        description: 'Generate realistic product mockups',
        href: '/mockup-generator',
        comingSoon: false,
      },
      {
        icon: ImageIcon,
        title: 'Festive Post Generator',
        description: 'Make festival posts with your name/brand',
        href: '/festive-post',
        comingSoon: false,
      },
      {
        icon: ImageIcon,
        title: 'Celebrity Collab AI',
        description: 'Get AI photos with your favorite celebrity',
        href: '/celebrity-photo',
        comingSoon: false,
      },
      {
        icon: ImageIcon,
        title: 'FutureMe Vision',
        description: 'See your future self in cinematic or fantasy style',
        href: '/future-self',
        comingSoon: false,
      },
    ],
  },
  {
    category: 'premium',
    title: 'Premium AI Suite',
    subtitle: 'Exclusive tools for pro creators.',
    features: [
      {
        icon: Mic,
        title: 'Magic Voice Studio',
        description: 'Create voiceovers with realistic AI voices',
        href: '#',
        comingSoon: true,
      },
      {
        icon: Video,
        title: 'Magic Video Generator',
        description: 'Generate stunning videos from text prompts',
        href: '#',
        comingSoon: true,
      },
    ],
  },
];

export function Features() {
  return (
    <section id="features" className="w-full py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Explore Magicpixa Tools
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            All your AI features, organized neatly for easy access.
          </p>
        </div>

        <Tabs defaultValue="photo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
            {featureCategories.map((category) => (
              <TabsTrigger
                key={category.category}
                value={category.category}
                className={cn(
                  'py-2.5 text-center text-sm font-medium transition-all',
                  category.category === 'premium' &&
                    'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent'
                )}
              >
                {category.category === 'premium' && (
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                )}
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {featureCategories.map((category) => (
            <TabsContent key={category.category} value={category.category}>
                <div className="text-center mb-8">
                    <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{category.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {category.features.map((feature) => (
                    <Card
                      key={feature.title}
                      className={cn(
                        'relative flex flex-col rounded-lg shadow-md hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 border-border/50 group bg-secondary',
                        feature.comingSoon && 'opacity-60 cursor-not-allowed hover:-translate-y-0'
                      )}
                    >
                      {feature.comingSoon && (
                        <Badge variant="default" className="absolute top-4 right-4 z-10">Coming Soon</Badge>
                      )}
                      <CardHeader className="p-6">
                        <div className="p-3 bg-primary/10 rounded-lg mb-4 w-fit">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground pt-1 text-sm">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="p-6 pt-0 mt-auto">
                        <Button
                          asChild
                          variant="link"
                          className="p-0 h-auto font-semibold text-sm"
                          disabled={feature.comingSoon}
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
            </TabsContent>
          ))}
        </Tabs>
        <p className="text-center text-primary/80 font-medium text-sm mt-12">
            More features coming soon to Magicpixa Pro+
        </p>
      </div>
    </section>
  );
}
