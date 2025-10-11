import { UploadCloud, Cpu, DownloadCloud } from 'lucide-react';

const steps = [
  {
    icon: UploadCloud,
    title: '1. Upload Image',
    description: 'Simply drag and drop or select a photo from your device.',
  },
  {
    icon: Cpu,
    title: '2. AI Enhances',
    description: 'Our powerful AI analyzes and improves your image in seconds.',
  },
  {
    icon: DownloadCloud,
    title: '3. Download Result',
    description: 'Save your beautifully enhanced, high-resolution photo.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Effortless Enhancement in 3 Steps
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Getting stunning photos has never been easier.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-3 md:gap-12 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="p-6 bg-background rounded-full shadow-md">
                    <step.icon className="h-12 w-12 text-accent" />
                </div>
                {index < steps.length - 1 && (
                    <div className="absolute top-1/2 left-full w-20 h-px bg-border hidden md:block" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
