import HeroSection from '@/components/landing/hero-section';
// import SocialProof from '@/components/landing/social-proof';
// import {HowItWorksSection as HowItWorks} from '@/components/landing/how-it-works';
import PlatformTools from '@/components/landing/platform-tools';
import { CtaSection as CTASection } from '@/components/landing/cta-section';
import { FooterSection as Footer } from '@/components/landing/footer';
// import ClientShell from '@/components/ui/client-shell';
import { Metadata } from 'next';
import { MetricsSection } from '@/components/landing/metrics-section';
import { Navbar } from '@/components/landing/navbar';
import { FeaturesSection } from '@/components/landing/features-section';
// import { DevelopersSection } from '@/components/landing/developer-section';

export const metadata: Metadata = {
  title: 'PromptOS - The Intelligence Platform for Prompt Engineering',
  description:
    'PromptOS is an intelligent prompt operating system designed to help developers create, manage, and optimize AI prompts for better results.',
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* <ClientShell> */}
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      {/* <HowItWorks /> */}
      <PlatformTools />
      <MetricsSection />
      {/* <DevelopersSection /> */}
      {/* <SocialProof /> */}
      <CTASection />
      <Footer />
      {/* </ClientShell> */}
    </div>
  );
}
