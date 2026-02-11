'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const roadmap = [
    { year: 'May 2025', title: 'Version 1.0.0 Released', desc: 'Initial public release of PromptOS with Prompt Enhancement, Scoring, Comparison, and Prompt Marketplace.' },
    { year: 'December 2025', title: 'Version 2.0.0 Released', desc: 'Revamp UI/UX, Profile Page Addition for Users, and Prompt Versioning' },
    { year: 'Februrary 2026', title: 'Version 2.1.0 Released', desc: 'New UI Revamp With Much better Landing Page' },
];

export default function Phases() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const container = containerRef.current;

        if (!section || !container) return;

        const ctx = gsap.context(() => {
            const scrollWidth = container.scrollWidth;
            const windowWidth = window.innerWidth;

            gsap.to(container, {
                x: () => -(scrollWidth - windowWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: `+=${scrollWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="phases" className="relative h-screen bg-orange-950 overflow-hidden flex items-center">
            <div className="absolute left-16 top-16 z-10">
                <h2 className="text-white opacity-50 text-sm font-mono uppercase tracking-widest">Timeline</h2>
            </div>

            <div ref={containerRef} className="flex items-center pl-[20vw] pr-[20vw] gap-[20vw]">
                {roadmap.map((item, i) => (
                    <div key={i} className="flex-shrink-0 w-[60vw] md:w-[40vw] flex flex-col gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
                        <div className="h-[1px] w-full bg-white/20 mb-8" />
                        <span className="text-orange-400 font-mono text-xl">{item.year}</span>
                        <h3 className="text-[6vw] font-bold text-white leading-none tracking-tighter">
                            {item.title}
                        </h3>
                        <p className="text-xl text-white/60 max-w-sm">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
