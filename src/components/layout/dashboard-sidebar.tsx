
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  BookImage,
  LayoutGrid,
  Sparkles,
  Settings,
  CreditCard,
  LifeBuoy,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { featureCategories } from '../sections/features';
import { Logo } from '../logo';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';

const mainNav = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { name: 'My Creations', icon: BookImage, href: '/dashboard/creations' },
];

const accountNav = [
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    { name: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { name: 'Help/FAQ', icon: LifeBuoy, href: '/dashboard/help' },
]


export function DashboardSidebar() {
  const pathname = usePathname();
  const defaultOpenCategories = featureCategories.map(c => c.category);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getVariant = (href: string) => {
    if (!isMounted) return 'ghost';
    if (pathname === href) return 'gradient';
    return 'outline';
  };
  
  if (!isMounted) {
    return (
        <div className="hidden md:flex flex-col h-full w-80 border-r bg-background">
          <div className="p-6">
            <Logo />
          </div>
          <div className="px-6 py-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
    );
  }

  return (
    <aside className="hidden md:flex flex-col h-full w-80 border-r bg-background">
      <div className="p-6 border-b">
        <Logo />
      </div>
      <ScrollArea className="flex-1">
        <div className="py-4 space-y-4 px-2">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</h3>
             {mainNav.map(item => (
                 <Button
                    key={item.name}
                    variant={getVariant(item.href)}
                    className={cn("w-full justify-start text-base py-4 rounded-2xl mx-2", getVariant(item.href) === 'outline' && 'btn-gradient-outline')}
                    asChild
                >
                    <Link href={item.href}>
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                    </Link>
                </Button>
             ))}

          <h3 className="px-4 pt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Tools</h3>
          <Accordion type="multiple" className="w-full" defaultValue={defaultOpenCategories}>
            {featureCategories.map((category) => (
              <AccordionItem value={category.category} key={category.category} className="border-b-0">
                <AccordionTrigger
                  className={cn('text-sm font-bold hover:no-underline rounded-2xl px-4 py-2 hover:bg-premium-gradient hover:text-primary-foreground',
                    category.category === 'premium' && 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent hover:bg-clip-padding'
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
                  <div className="flex flex-col space-y-1 mt-1 pl-4 border-l-2 border-primary/20 ml-2">
                    {category.features.map((feature) => (
                      <Button
                        key={feature.title}
                        variant={getVariant(feature.href)}
                        className={cn("w-full justify-start h-auto py-3 rounded-xl", getVariant(feature.href) === 'outline' ? 'btn-gradient-outline' : 'sidebar-feature-button')}
                        asChild
                      >
                        <Link href={feature.href} className="flex items-center text-sm">
                           <feature.icon className="mr-3 h-5 w-5" />
                           <div className="flex flex-col text-left">
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
          
           <h3 className="px-4 pt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</h3>
             {accountNav.map(item => (
                 <Button
                    key={item.name}
                    variant={getVariant(item.href)}
                    className={cn("w-full justify-start text-base py-4 rounded-2xl mx-2", getVariant(item.href) === 'outline' && 'btn-gradient-outline')}
                    asChild
                >
                    <Link href={item.href}>
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                    </Link>
                </Button>
             ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
