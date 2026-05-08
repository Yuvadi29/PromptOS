import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorks from '@/components/landing/how-it-works';
import CTASection from '@/components/landing/cta-section';
import Footer from '@/components/landing/footer';
import ClientShell from '@/components/ui/client-shell';
import Navbar from '@/components/landing/navbar';
import { Metadata } from 'next';
// import InfraStructure from '@/components/landing/infrastructure';
import Testimonial from '@/components/landing/Testimonial';
import Metrics from '@/components/landing/metrics';
import Security from '@/components/landing/Security';
import PromptEnhancerDemo from '@/components/landing/prompt-enhancer-demo';

export const metadata: Metadata = {
  title: 'PromptOS™ - The Autonomous Intelligence Layer',
  description:
    'The operating system for the next generation of AI agents. Execute, Optimize, and Scale with PromptOS™.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-orange-500/30">
      <ClientShell>
        <Navbar />

        <HeroSection />

        <PromptEnhancerDemo />

        <FeaturesSection />

        <HowItWorks />

        {/* <InfraStructure /> */}

        <Metrics />

        <Security />

        <Testimonial />

        <CTASection />

        <Footer />
      </ClientShell>
    </div>
  );
}
