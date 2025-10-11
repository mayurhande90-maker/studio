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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  BookImage,
  LayoutGrid,
  Menu,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { featureCategories } from '../sections/features';
import { Logo } from '../logo';

export function DashboardSidebar() {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Logo />
      </div>
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-4">
          <Button
            variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant={pathname === '/dashboard/creations' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/creations">
              <BookImage className="mr-2 h-4 w-4" />
              My Creations
            </Link>
          </Button>

          <Separator />

          <Accordion type="multiple" className="w-full">
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
                        variant={
                          pathname === feature.href ? 'secondary' : 'ghost'
                        }
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

  return (
    <>
      <div className="hidden md:block md:w-80 md:flex-shrink-0 border-r">
        {sidebarContent}
      </div>
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}