import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const showcaseItems = [
    {
        before: "https://picsum.photos/seed/before1/600/400",
        after: "https://picsum.photos/seed/after1/600/400",
        hint: "blurry portrait",
        title: "Magic Enhance"
    },
    {
        before: "https://picsum.photos/seed/before2/600/400",
        after: "https://picsum.photos/seed/after2/600/400",
        hint: "old photo",
        title: "Vintage Colorizer"
    },
    {
        before: "https://picsum.photos/seed/before3/600/400",
        after: "https://picsum.photos/seed/after3/600/400",
        hint: "product photo",
        title: "AI Photo Studio"
    }
]

export function Showcase() {
  return (
    <section id="showcase" className="w-full py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            See the Magic in Action
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Real transformations powered by Magicpixa AI.
          </p>
        </div>

        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {showcaseItems.map((item, index) => (
              <CarouselItem key={index}>
                <Card className="rounded-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                      <div className="relative aspect-video">
                        <Image
                          src={item.before}
                          alt={`Before ${item.title}`}
                          fill
                          className="object-cover"
                          data-ai-hint={item.hint}
                        />
                         <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">BEFORE</div>
                      </div>
                      <div className="relative aspect-video">
                        <Image
                          src={item.after}
                          alt={`After ${item.title}`}
                          fill
                          className="object-cover"
                           data-ai-hint={item.hint}
                        />
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">AFTER</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px]" />
          <CarouselNext className="right-[-50px]" />
        </Carousel>
      </div>
    </section>
  );
}
