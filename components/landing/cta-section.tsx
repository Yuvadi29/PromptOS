'use client';

import { useEffect, useRef } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const circlesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const circles = circlesRef.current;
        if (!section || !content || !circles) return;

        const ctx = gsap.context(() => {
            // Pin briefly
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: '+=50%',
                pin: true,
                pinSpacing: true,
            });

            // Scale content in
            gsap.fromTo(
                content,
                { scale: 0.88, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 60%',
                        end: 'top 10%',
                        scrub: 1,
                    },
                }
            );

            // Pulsing circles expand with scroll
            const circleEls = circles.children;
            Array.from(circleEls).forEach((circle, i) => {
                gsap.fromTo(
                    circle,
                    { scale: 0.5, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 0.08 - i * 0.015,
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: section,
                            start: `top ${80 - i * 10}%`,
                            end: `top ${30 - i * 5}%`,
                            scrub: 1,
                        },
                    }
                );
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative h-screen flex items-center justify-center overflow-hidden bg-zinc-950"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.06),transparent_70%)]" />

            {/* Concentric circles — scroll-driven */}
            <div ref={circlesRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[300, 500, 700, 900].map((size, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border border-orange-500/10 will-change-transform"
                        style={{
                            width: size,
                            height: size,
                            opacity: 0,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div
                ref={contentRef}
                className="relative z-10 text-center px-6 max-w-4xl mx-auto will-change-transform"
            >
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
                    <span className="text-white block">Ready to</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 block">
                        Transform
                    </span>
                    <span className="text-white block">Your Prompts?</span>
                </h2>

                <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
                    Join thousands of AI practitioners using PromptOS to craft better prompts,
                    compare models, and build smarter workflows.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="animate-pulse-glow rounded-full">
                        <AuthButton />
                    </div>
                    <Link
                        href="/docs"
                        data-cursor="pointer"
                        className="group flex items-center gap-2 px-7 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium transition-all"
                    >
                        Documentation
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
