
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  LayoutGrid,
  Heart,
  Plus,
  MoreVertical,
  Download,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';

const creations = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/creation1/400/300',
    imageHint: 'product bottle',
    title: 'Enhanced Bottle',
    feature: 'AI Photo Studio',
    date: '2024-07-28',
    isFavorite: true,
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/creation3/400/300',
    imageHint: 'logo mockup',
    title: 'Brand Logo Mockup',
    feature: 'Mockup Maker',
    date: '2024-07-26',
    isFavorite: false,
  },
    {
    id: 4,
    imageUrl: 'https://picsum.photos/seed/creation4/400/300',
    imageHint: 'youtube thumbnail',
    title: 'Gaming Thumbnail',
    feature: 'Thumbnail Forge',
    date: '2024-07-25',
    isFavorite: true,
  },
  {
    id: 5,
    imageUrl: 'https://picsum.photos/seed/creation5/400/300',
    imageHint: 'document scan',
    title: 'Invoice Scan',
    feature: 'DocuScan Pro',
    date: '2024-07-24',
    isFavorite: false,
  },
  {
    id: 6,
    imageUrl: 'https://picsum.photos/seed/creation6/400/300',
    imageHint: 'removed background',
    title: 'Portrait cutout',
    feature: 'Background Eraser',
    date: '2024-07-23',
    isFavorite: false,
  },
];

export default function CreationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredCreations = creations.filter(
    (creation) =>
      creation.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'All' || creation.feature === filter)
  );

  return (
    <div className="relative min-h-full">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold">My Creations</h1>
        <p className="text-lg text-muted-foreground">
          All your AI-generated magic in one place.
        </p>
      </div>

      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search creations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              <span>{filter}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setFilter('All')}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter('AI Photo Studio')}>
              AI Photo Studio
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter('Mockup Maker')}>
              Mockup Maker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredCreations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreations.map((creation) => (
            <Card
              key={creation.id}
              className="group overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"
            >
              <CardHeader className="p-0 relative">
                <Image
                  src={creation.imageUrl}
                  alt={creation.title}
                  width={400}
                  height={300}
                  data-ai-hint={creation.imageHint}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                 <div className="absolute top-3 right-3 flex gap-2">
                     <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-8 w-8 bg-black/30 text-white hover:bg-black/50 hover:text-white"
                     >
                        <Heart
                            className={`h-4 w-4 ${creation.isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                        />
                     </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 bg-black/30 text-white hover:bg-black/50 hover:text-white">
                                <MoreVertical className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                            <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{creation.title}</h3>
                <p className="text-sm text-muted-foreground">{creation.feature}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                 <p className="text-xs text-muted-foreground">{creation.date}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Creations Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try creating something new to see it here.
          </p>
        </div>
      )}
        <Button variant="gradient" className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-lg hover:scale-110 transition-transform">
            <Plus className="h-8 w-8" />
        </Button>
    </div>
  );
}
