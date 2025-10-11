import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-image');

export function About() {
  return (
    <section id="about" className="w-full py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex items-center justify-center">
             {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                width={500}
                height={700}
                data-ai-hint={aboutImage.imageHint}
                className="rounded-2xl shadow-xl object-cover"
              />
            )}
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Mission</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                The Future of Photography is Here
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                MagicPixa was born from a love of photography and a fascination with AI innovation. We believe everyone deserves to have their memories captured in the best possible light. Our mission is to make professional-grade photo enhancement accessible to all, empowering creativity and preserving moments with stunning clarity and beauty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
