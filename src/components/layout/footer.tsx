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

const footerLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy Policy', href: '#' },
];

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
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
    <footer className="bg-secondary/20 border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Your personal AI photo studio. Enhance, edit, and colorize photos
              effortlessly.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© 2025 Magicpixa. All rights reserved.</p>
        </div>
      </div>
      <Button
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-4 right-4 rounded-full p-2 transition-opacity duration-300 shadow-lg',
          showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        variant="default"
        size="icon"
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Back to Top</span>
      </Button>
    </footer>
  );
}
