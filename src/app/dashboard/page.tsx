
'use client';

import { useUser } from '@/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCredits } from '@/hooks/use-credits';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins, BookImage, Settings, CreditCard, Activity, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const activityItems = [
    { id: 1, action: 'Generated an image with', feature: 'AI Photo Studio', time: '2 hours ago' },
    { id: 2, action: 'Upgraded to', feature: 'Pro Plan', time: '1 day ago' },
    { id: 3, action: 'Used', feature: 'Vintage Colorizer', time: '3 days ago' },
    { id: 4, action: 'Added 100 credits', feature: '', time: '5 days ago' },
];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { credits, isLoading: isCreditsLoading } = useCredits();

  const getDisplayName = () => {
    if (isUserLoading) return <Skeleton className="h-8 w-48" />;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const StatCard = ({ title, value, icon: Icon, isLoading, description }: { title: string, value: string | number, icon: React.ElementType, isLoading: boolean, description: string }) => (
    <Card className="rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24 mt-1" /> : <div className="text-3xl font-bold">{value}</div>}
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome back, {getDisplayName()}!</h1>
        <p className="text-lg text-muted-foreground">
          Here's a quick overview of your account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Credits Left" value={credits ?? 0} icon={Coins} isLoading={isCreditsLoading || isUserLoading} description="Available for use" />
        <StatCard title="Creations This Week" value={7} icon={BookImage} isLoading={isUserLoading} description="+2 since last week" />
        <StatCard title="Plan Type" value="Free" icon={CreditCard} isLoading={isUserLoading} description="Upgrade for more features" />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg rounded-2xl">
          <TabsTrigger value="overview" className='rounded-xl'>Overview</TabsTrigger>
          <TabsTrigger value="creations" className='rounded-xl'>My Creations</TabsTrigger>
          <TabsTrigger value="settings" className='rounded-xl'>Settings</TabsTrigger>
          <TabsTrigger value="billing" className='rounded-xl'>Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <Card className="mt-6 rounded-3xl">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of your recent actions in MagicPixa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activityItems.map(item => (
                            <div key={item.id} className="flex items-center">
                                <div className="p-2 bg-secondary rounded-full mr-4">
                                   <Activity className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.action} <span className="font-bold text-primary">{item.feature}</span></p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="creations">
           <Card className="mt-6 rounded-3xl text-center p-12">
             <CardContent>
                <h3 className="text-lg font-semibold">Your Creations</h3>
                <p className="text-muted-foreground mb-4">You have 7 creations so far.</p>
                <Button asChild>
                    <Link href="/dashboard/creations">View All Creations</Link>
                </Button>
             </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card className="mt-6 rounded-3xl p-6">
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your profile and preferences.</CardDescription>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card className="mt-6 rounded-3xl p-6">
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your subscription and payment methods.</CardDescription>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
