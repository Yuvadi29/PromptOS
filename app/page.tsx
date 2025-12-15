import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorks from '@/components/landing/how-it-works';
import CTASection from '@/components/landing/cta-section';
import Footer from '@/components/landing/footer';
import Phases from '@/components/Phases';
import LatestBlogs from '@/components/landing/latest-blogs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PromptOS - The Intelligent Prompt Operating System',
  description: 'PromptOS is an intelligent prompt operating system designed to help developers create, manage, and optimize AI prompts for better results.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroSection />
      <FeaturesSection />
      <Phases />
      <HowItWorks />
      <LatestBlogs />
      <CTASection />
      <Footer />
    </div>
  );
}
