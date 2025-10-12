
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-image');

  const values = [
    'Innovation at the Core',
    'User-Centric Design',
    'Uncompromising Quality',
    'Ethical AI Practices',
  ];

  return (
    <div className="w-full py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-gradient animated-gradient">
              About MagicPixa
            </h1>
            <p className="text-xl text-muted-foreground font-semibold">
              Our mission is to empower everyone—from individual creators to large businesses—to produce stunning, studio-quality visuals effortlessly.
            </p>
            <p className="text-muted-foreground">
              MagicPixa was born from a simple idea: professional-grade photo editing and design should be accessible to all, not just those with complex software and years of experience. We leverage cutting-edge generative AI to build intuitive tools that automate tedious tasks, unlock creative potential, and deliver breathtaking results in seconds. Whether you're enhancing a product shot, colorizing a cherished memory, or designing a viral marketing post, MagicPixa is your creative co-pilot.
            </p>
             <div className="grid grid-cols-2 gap-4">
              {values.map((value) => (
                <div key={value} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button asChild size="lg" variant="gradient" className="text-primary-foreground font-semibold">
                <Link href="/dashboard/photo-studio">
                  Try AI Photo Studio <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            {aboutImage && (
              <div className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-2xl">
                 <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    width={600}
                    height={800}
                    data-ai-hint={aboutImage.imageHint}
                    className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
