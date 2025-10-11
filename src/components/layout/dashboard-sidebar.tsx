'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  BookImage,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { featureCategories } from '../sections/features';
import { Logo } from '../logo';
import { useEffect, useState } from 'react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const defaultOpenCategories = featureCategories.map(c => c.category);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getVariant = (href: string) => {
    if (!isMounted) return 'ghost';
    // This is a simple check. For more complex routing, you might need a more robust solution.
    // e.g., if you have /dashboard/settings and /dashboard/settings/profile
    if (pathname === href) return 'secondary';
    // Handle case for nested routes if needed, e.g. pathname.startsWith(href) for parent links
    return 'ghost';
  };
  
  if (!isMounted) {
    return (
        <div className="hidden md:flex flex-col h-full w-80 border-r bg-background">
          {/* You can put a skeleton loader here if you want */}
        </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col h-full w-80 border-r bg-background">
      <div className="p-6">
        <Logo />
      </div>
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-4">
          <Button
            variant={getVariant('/dashboard')}
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant={getVariant('/dashboard/creations')}
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/creations">
              <BookImage className="mr-2 h-4 w-4" />
              My Creations
            </Link>
          </Button>

          <Separator />

          <Accordion type="multiple" className="w-full" defaultValue={defaultOpenCategories}>
            {featureCategories.map((category) => (
              <AccordionItem value={category.category} key={category.category}>
                <AccordionTrigger
                  className={cn('text-sm font-semibold hover:no-underline',
                    category.category === 'premium' && 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent'
                  )}
                >
                  <div className="flex items-center">
                  {category.category === 'premium' && (
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                  )}
                  {category.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-1 pl-2 border-l-2 border-primary/50 ml-2">
                    {category.features.map((feature) => (
                      <Button
                        key={feature.title}
                        variant={getVariant(feature.href)}
                        className="w-full justify-start h-auto py-2"
                        asChild
                      >
                        <Link href={feature.href} className="flex items-center text-sm">
                           <feature.icon className="mr-3 h-4 w-4" />
                           <div className="flex flex-col">
                            <span>{feature.title}</span>
                           </div>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
