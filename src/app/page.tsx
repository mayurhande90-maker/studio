import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Reviews } from '@/components/sections/reviews';
import { Pricing } from '@/components/sections/pricing';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Reviews />
      <Pricing />
    </>
  );
}
