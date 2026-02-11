'use client';

import { useEffect, useRef } from 'react';
import { Pencil, Cpu, BarChart3, Rocket } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        id: '01',
        title: 'Draft',
        description: 'Input your raw idea. Our context engine analyzes intent.',
        icon: Pencil,
    },
    {
        id: '02',
        title: 'Enhance',
        description: 'AI rewrites your prompt for maximum clarity and precision.',
        icon: Cpu,
    },
    {
        id: '03',
        title: 'Test',
        description: 'Run against multiple models with real-time scoring.',
        icon: BarChart3,
    },
    {
        id: '04',
        title: 'Deploy',
        description: 'Push to production usage with version control.',
        icon: Rocket,
    },
];

export default function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const rightCol = rightColRef.current;

        if (!section || !rightCol) return;

        const ctx = gsap.context(() => {
            // Pin the left side, scroll the right side
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                pin: '.pin-left',
                pinSpacing: false,
            });

            // Animate steps on the right as they enter
            const stepEls = gsap.utils.toArray('.step-card');
            stepEls.forEach((step: any, i) => {
                gsap.from(step, {
                    opacity: 0.2,
                    scale: 0.9,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: step,
                        start: 'top center',
                        end: 'bottom center',
                        toggleActions: 'play reverse play reverse',
                        scrub: true,
                    },
                });
            });

        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="how-it-works" className="relative flex bg-zinc-950 text-white">
            {/* Left Column - Fixed */}
            <div className="pin-left w-1/2 h-screen flex flex-col justify-between p-16 md:p-24 border-r border-white/10">
                <div>
                    <span className="text-orange-500 font-mono text-sm tracking-widest uppercase mb-4 block">Process</span>
                    <h2 className="text-[6vw] font-bold leading-none tracking-tighter">
                        How It<br />Works
                    </h2>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                </div>
            </div>

            {/* Right Column - Scrollable */}
            <div ref={rightColRef} className="w-1/2 flex flex-col">
                {steps.map((step, i) => (
                    <div
                        key={step.id}
                        className="step-card h-[80vh] flex flex-col justify-center p-16 md:p-24 border-b border-white/5 last:border-0"
                    >
                        <span className="text-[8rem] font-bold text-white/5 leading-none select-none -ml-4 mb-8 font-geist-mono">
                            {step.id}
                        </span>
                        <h3 className="text-4xl md:text-5xl font-bold mb-6 text-orange-500">
                            {step.title}
                        </h3>
                        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
