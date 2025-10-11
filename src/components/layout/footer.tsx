import { Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../logo';

const socialLinks = [
  { icon: Twitter, href: '#', name: 'Twitter' },
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Linkedin, href: '#', name: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Making Every Pixel Magical.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#home" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link href="#how-it-works" className="text-muted-foreground hover:text-foreground">How It Works</Link></li>
              <li><Link href="#about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
             <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© 2025 MagicPixa — All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
