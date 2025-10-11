import { Wand2, Palette, Sparkles, BrainCircuit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: Wand2,
    title: 'Auto Enhance',
    description: 'Instantly fixes lighting, contrast, and sharpness with a single click.',
  },
  {
    icon: Palette,
    title: 'AI Color Boost',
    description: 'Adds natural color depth and vibrancy to your photos intelligently.',
  },
  {
    icon: Sparkles,
    title: 'Smart Retouch',
    description: 'Removes unwanted marks, blemishes, and improves facial details seamlessly.',
  },
  {
    icon: BrainCircuit,
    title: 'Advanced AI',
    description: 'Powered by a cutting-edge generative model for superior results.',
  }
];

export function Features() {
  return (
    <section id="features" className="w-full py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Features, Magical Results
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover how MagicPixa transforms your photos with state-of-the-art AI.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 xl:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-none transform hover:-translate-y-2">
              <CardHeader className="items-center text-center p-8">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4">
                    <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground pt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
