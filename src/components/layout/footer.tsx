
'use client';

import { Instagram, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../logo';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const socialLinks = [
  { icon: Twitter, href: '#', name: 'Twitter' },
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Linkedin, href: '#', name: 'LinkedIn' },
];

const footerLinkGroups = [
  {
    title: 'Magicpixa',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Contact', href: '#' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '#' },
    ],
  },
];

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary/30 border-t border-border/50">
      <div className="container mx-auto py-16 px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm">
             Magicpixa is your personal AI studio — enhance, create, and reimagine effortlessly.
            </p>
          </div>
          {footerLinkGroups.map(group => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold mb-4 text-foreground/90">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
           <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground/90">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className='text-sm text-muted-foreground'>© {currentYear} Magicpixa. All rights reserved.</p>
        </div>
      </div>
      <Button
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-6 right-6 rounded-full p-2.5 transition-all duration-300 shadow-lg z-50',
          'bg-primary/90 text-primary-foreground backdrop-blur-sm ring-2 ring-primary/50',
          showBackToTop ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        )}
        variant="default"
        size="icon"
        aria-label="Back to Top"
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Back to Top</span>
      </Button>
    </footer>
  );
}
