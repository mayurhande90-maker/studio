
'use client';

import { useUser } from '@/firebase/use-user';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { featureCategories } from '@/components/sections/features';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome back, {user?.displayName || 'Creator'}!</h1>
        <p className="text-lg text-muted-foreground">
          Ready to create some magic? Here are your available tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCategories.flatMap(category => category.features).map((feature) => (
          <Card key={feature.title} className="flex flex-col group hover:shadow-primary/10 transition-all duration-300">
            <CardHeader className="flex-row items-center gap-4">
               <div className="icon-container">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              <div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end justify-between">
                {feature.comingSoon ? (
                    <span className="text-sm font-semibold text-muted-foreground">Coming Soon</span>
                ) : (
                    <Button asChild variant="link" className="p-0 font-semibold">
                        <Link href={feature.href}>
                            Try Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
