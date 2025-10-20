'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/use-user';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// Mock data for creations. In a real app, this would come from a database.
const userCreations = PlaceHolderImages.filter(img => img.id.startsWith('hero'));

export default function DashboardCreations() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [creations, setCreations] = useState<any[]>([]);
  const [isLoadingCreations, setIsLoadingCreations] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // Simulate fetching creations
    if(user) {
        setTimeout(() => {
            setCreations(userCreations);
            setIsLoadingCreations(false);
        }, 1500);
    }
  }, [user]);


  if (loading || isLoadingCreations) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
       <div className="space-y-2">
            <h1 className="text-4xl font-bold">Your Creations</h1>
            <p className="text-lg text-muted-foreground">
              A gallery of all the images you've generated with MagicPixa.
            </p>
        </div>

        {creations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {creations.map((creation, index) => (
                    <Card key={index} className="overflow-hidden group">
                        <CardContent className="p-0">
                           <div className="relative aspect-square">
                             <Image 
                                src={creation.imageUrl}
                                alt={creation.description}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-transform duration-300 group-hover:scale-110"
                             />
                           </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
             <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px] rounded-3xl">
                <CardHeader>
                    <CardTitle>No Creations Yet</CardTitle>
                    <CardDescription>You haven't generated any images. Let's create some magic!</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="gradient">
                        <Link href="/dashboard/photo-studio">Go to AI Photo Studio</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
