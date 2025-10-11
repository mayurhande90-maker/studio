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
      plan: 'Free — Discover',
      price: '₹0',
      period: '/ month',
      features: [
        '10 credits/month',
        'Access to basic tools',
        'Watermark on exports',
        'Standard processing speed',
      ],
      buttonLabel: 'Start Free Trial',
      variant: 'outline' as const,
    },
    {
      plan: 'Pro — Create More',
      price: '₹299',
      period: '/ month',
      features: [
        '100 credits',
        'No watermark',
        'Access to premium templates',
        'Priority processing',
      ],
      buttonLabel: 'Start Free Trial',
      variant: 'default' as const,
      recommended: true,
    },
    {
      plan: 'Premium+ — Live Fully',
      price: '₹499',
      period: '/ month',
      features: [
        'Unlimited access',
        'Exclusive new AI tools',
        'Dedicated support',
        'Top priority queue',
      ],
      buttonLabel: 'Start Free Trial',
      variant: 'outline' as const,
    },
  ],
  yearly: [
     {
      plan: 'Free — Discover',
      price: '₹0',
      period: '/ month',
      features: [
        '10 credits/month',
        'Access to basic tools',
        'Watermark on exports',
        'Standard processing speed',
      ],
      buttonLabel: 'Start Free Trial',
      variant: 'outline' as const,
    },
    {
      plan: 'Pro — Create More',
      price: '₹2999',
      period: '/ year',
      features: [
        '100 credits / month',
        'No watermark',
        'Access to premium templates',
        'Priority processing',
      ],
      buttonLabel: 'Start Free Trial',
      variant: 'default' as const,
      recommended: true,
    },
    {
      plan: 'Premium+ — Live Fully',
      price: '₹4999',
      period: '/ year',
      features: [
        'Unlimited access',
        'Exclusive new AI tools',
        'Dedicated support',
        'Top priority queue',
      ],
      buttonLabel: 'Start Free Trial',
      variant: 'outline' as const,
    },
  ],
};

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = isYearly ? pricingData.yearly : pricingData.monthly;

  return (
    <section id="pricing" className="w-full py-20 lg:py-32 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Choose Your Plan — Start Free, Upgrade Anytime.
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Save up to 2 months with a yearly plan.
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

        <div className="mx-auto grid max-w-7xl items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
          {plans.map((plan) => (
            <Card
              key={plan.plan}
              className={cn(
                'relative flex flex-col rounded-3xl shadow-lg hover:shadow-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm border border-border/10 overflow-hidden',
                plan.recommended ? 'border-primary shadow-primary/10' : ''
              )}
            >
              {plan.recommended && (
                <Badge className="absolute top-6 right-6" variant="default">Recommended</Badge>
              )}
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-bold">{plan.plan}</CardTitle>
                <CardDescription className="flex items-baseline gap-2 pt-4">
                  <span className="text-4xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8">
                <Button className="w-full rounded-2xl text-base py-6" variant={plan.variant}>
                  {plan.buttonLabel}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-12">
            7-day free trial on Pro and Premium+ plans. Cancel anytime. No hidden fees.
        </p>
      </div>
    </section>
  );
}
