'use client';

import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '../ui/card';

const reviews = [
  {
    name: 'Aarav Mehta',
    city: 'Mumbai',
    designation: 'Product Photographer',
    rating: 5,
    review:
      'The background remover is unbelievably fast and accurate. Saves me hours every day!',
  },
  {
    name: 'Priya Deshmukh',
    city: 'Pune',
    designation: 'Digital Marketer',
    rating: 4,
    review:
      'Photo Studio makes my product photos look like they were shot professionally. Super impressed!',
  },
  {
    name: 'Rohan Nair',
    city: 'Bengaluru',
    designation: 'E-commerce Seller',
    rating: 5,
    review:
      'Enhancement tool is a game changer! My product images look 10x better instantly.',
  },
  {
    name: 'Sneha Patil',
    city: 'Nashik',
    designation: 'Wedding Photographer',
    rating: 4,
    review:
      'Loved the colorizer feature — it brought life to my grandparents’ old photos beautifully.',
  },
  {
    name: 'Karan Sharma',
    city: 'Delhi',
    designation: 'Designer',
    rating: 5,
    review:
      'Very clean interface and amazing results. Definitely worth upgrading to Pro.',
  },
];

export function Reviews() {
  return (
    <section
      id="reviews"
      className="w-full py-20 lg:py-32 bg-background"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Loved by Thousands of Users
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              See what our Indian users say about Magicpixa.
            </p>
          </div>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full max-w-5xl mx-auto mt-12"
        >
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/50 backdrop-blur-sm border border-white/10">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground/50'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">
                        “{review.review}”
                      </p>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {review.designation}, {review.city}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
