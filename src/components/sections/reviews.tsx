'use client';

import { Star, User } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const reviews = [
  {
    name: 'Aarav Sharma',
    city: 'Pune',
    rating: 5,
    review: 'Best AI app for creators!',
    avatar: 'AS'
  },
  {
    name: 'Ritika Menon',
    city: 'Mumbai',
    rating: 5,
    review: 'My brand posters look like agency work.',
    avatar: 'RM'
  },
  {
    name: 'Karan Patel',
    city: 'Ahmedabad',
    rating: 4,
    review: 'Easy and addictive.',
    avatar: 'KP'
  },
  {
    name: 'Sneha Desai',
    city: 'Nashik',
    rating: 5,
    review: 'Turned my old photo into magic.',
    avatar: 'SD'
  },
  {
    name: 'Aditya Khanna',
    city: 'Delhi',
    rating: 4,
    review: 'Perfect for my YouTube channel.',
    avatar: 'AK'
  },
  {
    name: 'Neha Singh',
    city: 'Bengaluru',
    rating: 5,
    review: 'The background removal is flawless. A must-have tool!',
    avatar: 'NS'
  }
];

export function Reviews() {
  return (
    <section
      id="reviews"
      className="w-full py-20 lg:py-32 bg-background"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by Creators Across India 🇮🇳
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Real feedback from users who’ve transformed their creative flow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/50 backdrop-blur-sm border border-border/10">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {review.city}
                      </p>
                    </div>
                  </div>
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
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
