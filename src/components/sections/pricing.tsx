
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
      plan: 'Free Plan',
      price: '₹0',
      period: '/month',
      features: [
        '10 credits/month',
        'Access to basic tools',
        'Watermark on exports',
        'Standard processing',
      ],
      buttonLabel: 'Start Free',
      variant: 'outline' as const,
    },
    {
      plan: 'Pro Plan',
      price: '₹299',
      period: '/month',
      features: [
        'Everything from Free Plan',
        '100 credits/month',
        'No watermark',
        'Premium templates',
        'Priority processing',
      ],
      buttonLabel: 'Upgrade to Pro',
      variant: 'gradient' as const,
      recommended: false,
    },
    {
      plan: 'Premium Plan',
      price: '₹499',
      period: '/month',
      features: [
        'Everything from Pro Plan',
        '350 credits/month',
        'Premium templates & priority processing',
      ],
      buttonLabel: 'Go Premium',
      variant: 'outline' as const,
      recommended: true,
    },
     {
      plan: 'VIP Plan',
      price: '₹1999',
      period: '/month',
      features: [
        'Everything from Premium Plan',
        'Unlimited credits',
        'Exclusive tools',
        'Dedicated support',
        'Top priority queue',
      ],
      buttonLabel: 'Go VIP',
      variant: 'outline' as const,
    },
  ],
  yearly: [
    {
      plan: 'Free Plan',
      price: '₹0',
      period: '/month',
      features: [
        '10 credits/month',
        'Access to basic tools',
        'Watermark on exports',
        'Standard processing',
      ],
      buttonLabel: 'Start Free',
      variant: 'outline' as const,
    },
    {
      plan: 'Pro Plan',
      price: '₹249',
      period: '/month (billed yearly)',
      features: [
        'Everything from Free Plan',
        '100 credits/month',
        'No watermark',
        'Premium templates',
        'Priority processing',
      ],
      buttonLabel: 'Upgrade to Pro',
      variant: 'gradient' as const,
      recommended: false,
    },
    {
      plan: 'Premium Plan',
      price: '₹399',
      period: '/month (billed yearly)',
      features: [
        'Everything from Pro Plan',
        '350 credits/month',
        'Premium templates & priority processing',
      ],
      buttonLabel: 'Go Premium',
      variant: 'outline' as const,
      recommended: true,
    },
     {
      plan: 'VIP Plan',
      price: '₹1499',
      period: '/month (billed yearly)',
      features: [
        'Everything from Premium Plan',
        'Unlimited credits',
        'Exclusive tools',
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
    <section id="pricing" className="w-full py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-background rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Plans for Everyone
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium">
                Choose a plan — Monthly or Yearly (Save up to 25%)
              </p>
            </div>
            <div className="flex items-center space-x-4 pt-8">
              <Label htmlFor="pricing-toggle" className="font-bold text-lg">Monthly</Label>
              <Switch
                id="pricing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
                aria-label="Toggle between monthly and yearly pricing"
              />
              <Label htmlFor="pricing-toggle" className="font-bold text-lg">Yearly</Label>
            </div>
          </div>

          <div className="mx-auto grid max-w-7xl items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4 mt-16">
            {plans.map((plan) => (
              <Card
                key={plan.plan}
                className={cn(
                  'relative flex flex-col rounded-3xl shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2',
                  plan.recommended ? 'border-2 border-primary shadow-primary/10' : 'border'
                )}
              >
                {plan.recommended && (
                  <Badge className="absolute top-4 right-4 px-2 py-0.5 text-[10px] font-bold" variant="gradient">Recommended</Badge>
                )}
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold">{plan.plan}</CardTitle>
                  <CardDescription className="flex items-baseline gap-2 pt-4">
                    <span className="text-4xl font-extrabold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6">
                  <Button
                    className={cn('w-full text-base py-6 font-bold rounded-2xl', {
                      'btn-gradient-border text-primary-foreground bg-transparent': plan.variant === 'outline',
                    })}
                    variant={plan.variant}
                  >
                    {plan.buttonLabel}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground font-extrabold text-xl mt-12">
              Upgrade or cancel anytime. Instant access after purchase.
          </p>
        </div>
      </div>
    </section>
  );
}
