'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const pricingData = {
  monthly: [
    {
      plan: 'Free',
      price: '₹0',
      period: '/ month',
      features: [
        '10 credits / month',
        'Access to basic tools',
        'Watermark on exports',
        'Standard processing speed',
      ],
      buttonLabel: 'Start Free',
      variant: 'outline' as const,
    },
    {
      plan: 'Pro',
      price: '₹299',
      period: '/ month',
      features: [
        '100 credits',
        'No watermark',
        'Access to premium templates',
        'Priority processing',
      ],
      buttonLabel: 'Upgrade to Pro',
      variant: 'default' as const,
      recommended: true,
    },
    {
      plan: 'Premium',
      price: '₹499',
      period: '/ month',
      features: [
        '350 credits',
        'No watermark',
        'Premium templates & priority processing',
      ],
      buttonLabel: 'Go Premium',
      variant: 'outline' as const,
    },
    {
      plan: 'VIP',
      price: '₹1999',
      period: '/ month',
      features: [
        'Unlimited credits',
        'Exclusive new AI tools',
        'Dedicated support',
        'Top priority queue',
      ],
      buttonLabel: 'Go VIP',
      variant: 'outline' as const,
    },
  ],
  yearly: [
    {
      plan: 'Free',
      price: '₹0',
      period: '/ month',
      features: [
        '10 credits / month',
        'Access to basic tools',
        'Watermark on exports',
        'Standard processing speed',
      ],
      buttonLabel: 'Start Free',
      variant: 'outline' as const,
    },
    {
      plan: 'Pro',
      price: '₹249',
      period: '/ month (billed yearly)',
      features: [
        '100 credits / month',
        'No watermark',
        'Access to premium templates',
        'Priority processing',
      ],
      buttonLabel: 'Upgrade to Pro',
      variant: 'default' as const,
      recommended: true,
    },
    {
      plan: 'Premium',
      price: '₹399',
      period: '/ month (billed yearly)',
      features: [
        '350 credits / month',
        'No watermark',
        'Premium templates & priority processing',
      ],
      buttonLabel: 'Go Premium',
      variant: 'outline' as const,
    },
    {
      plan: 'VIP',
      price: '₹1499',
      period: '/ month (billed yearly)',
      features: [
        'Unlimited credits',
        'Exclusive new AI tools',
        'Dedicated support',
        'Top priority queue',
      ],
      buttonLabel: 'Go VIP',
      variant: 'outline' as const,
    },
  ],
};

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = isYearly ? pricingData.yearly : pricingData.monthly;

  return (
    <section id="pricing" className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Choose Your Plan
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Monthly or Yearly — best deals below.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <Label htmlFor="pricing-toggle">Monthly</Label>
            <Switch
              id="pricing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              aria-label="Toggle between monthly and yearly pricing"
            />
            <Label htmlFor="pricing-toggle">Yearly</Label>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {plans.map((plan) => (
            <Card
              key={plan.plan}
              className={cn(
                'relative flex flex-col rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/10 overflow-hidden',
                plan.recommended ? 'border-primary' : ''
              )}
            >
              {plan.recommended && (
                <Badge className="absolute top-4 right-4" variant="default">Recommended</Badge>
              )}
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold">{plan.plan}</CardTitle>
                <CardDescription className="flex items-baseline gap-2 pt-2">
                  <span className="text-4xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6">
                <Button className="w-full" variant={plan.variant}>
                  {plan.buttonLabel}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-12">
            Upgrade anytime. Cancel at any time. No hidden fees.
        </p>
      </div>
    </section>
  );
}
