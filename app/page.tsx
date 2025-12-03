'use client';

import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorks from '@/components/landing/how-it-works';
import CTASection from '@/components/landing/cta-section';
import Footer from '@/components/landing/footer';
import Phases from '@/components/Phases';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroSection />
      <FeaturesSection />
      <Phases />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}
