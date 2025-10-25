
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Pricing } from '@/components/sections/pricing';
import { Reviews } from '@/components/sections/reviews';

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
