'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const reviews = [
  {
    name: 'Aarav Mehta',
    location: 'Mumbai | Product Photographer',
    rating: 5,
    review: 'The AI Photo Studio makes my product images look like they were shot in a high-end studio.',
  },
  {
    name: 'Priya Deshmukh',
    location: 'Pune | Digital Marketer',
    rating: 4,
    review: 'AutoCaption and Photo Studio saved me hours. Love the smooth results.',
  },
  {
    name: 'Rohan Nair',
    location: 'Bengaluru | E-commerce Seller',
    rating: 5,
    review: 'Every product image now looks polished. The enhance tool is a game-changer.',
  },
  {
    name: 'Sneha Patil',
    location: 'Nashik | Wedding Photographer',
    rating: 4,
    review: 'Colorizer feature revived my grandparents’ photos beautifully.',
  },
  {
    name: 'Karan Sharma',
    location: 'Delhi | Designer',
    rating: 5,
    review: 'The design is clean, but the AI tools are powerful. Worth every rupee.',
  },
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
            What Our Users Say
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            From creators to photographers — real results, real stories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
                <Card key={index} className="rounded-lg shadow-md bg-card">
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
                    <p className="text-foreground text-base">
                    “{review.review}”
                    </p>
                    <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {review.location}
                    </p>
                    </div>
                </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
