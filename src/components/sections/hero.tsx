'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageEnhancer } from '@/components/image-enhancer';

const beforeImage = PlaceHolderImages.find(
  (img) => img.id === 'hero-image-before'
);
const afterImage = PlaceHolderImages.find(
  (img) => img.id === 'hero-image-after'
);

export function Hero() {
  return (
    <section id="home" className="w-full bg-background pt-24 md:pt-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
                Bring your photos to life with{' '}
                <span className="text-gradient">AI</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                MagicPixa enhances your images in seconds — clarity, detail, and
                color balance powered by AI.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full sm:w-auto mx-auto lg:mx-0 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity rounded-xl shadow-lg text-lg py-7 px-8 uppercase tracking-wider font-semibold"
                >
                  Try Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] p-0">
                <ImageEnhancer />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg mx-auto">
              {beforeImage && afterImage && (
                <div className="relative rounded-2xl shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1/2 h-full z-10 overflow-hidden">
                     <Image
                      src={beforeImage.imageUrl}
                      alt={beforeImage.description}
                      width={800}
                      height={600}
                      data-ai-hint={beforeImage.imageHint}
                      className="object-cover w-full h-full scale-150"
                    />
                  </div>
                  <Image
                    src={afterImage.imageUrl}
                    alt={afterImage.description}
                    width={800}
                    height={600}
                    data-ai-hint={afterImage.imageHint}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">BEFORE</div>
                    <div className="absolute top-4 right-4 bg-white/80 text-black px-3 py-1 rounded-full text-sm font-medium">AFTER</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
