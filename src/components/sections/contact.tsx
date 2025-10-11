import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="w-full py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
           <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Get in Touch
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
           <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity rounded-xl shadow-lg text-lg py-7 px-8 uppercase tracking-wider font-semibold">
            <Link href="mailto:contact@magicpixa.com">
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
