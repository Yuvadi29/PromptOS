'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AsciiCube } from './ascii-cube';
import { AsciiSphere } from './ascii-sphere';

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`relative rounded-2xl overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Background with grid */}
          <div className="absolute inset-0 bg-foreground" />
          <div className="absolute inset-0 grid-pattern opacity-10" />

          {/* Cube animation as full background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-25">
            <AsciiCube className="w-[600px] h-[500px]" />
          </div>

          <div className="relative z-10 px-8 lg:px-16 py-16 bg-transparent lg:py-0.5">
            <div className="flex items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight mb-6 text-background text-balance">
                  Start crafting better prompts, today.
                </h2>

                <p className="text-lg text-background/70 mb-8 leading-relaxed max-w-lg">
                  Join developers shipping AI products faster with PromptOS. Free to start, open
                  source forever.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    size="lg"
                    className="bg-background hover:bg-background/90 text-foreground px-6 h-12 text-sm font-medium group"
                  >
                    Get started free
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 text-sm font-medium border-background/30 text-background hover:bg-background/10 bg-transparent"
                  >
                    Talk to sales
                  </Button>
                </div>

                <p className="text-sm text-background/50 mt-6 font-mono">No credit card required</p>
              </div>

              {/* Animated ASCII Sphere */}
              <div className="hidden lg:block opacity-40">
                <AsciiSphere className="w-[600px] h-[560px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
