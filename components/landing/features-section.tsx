'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Target, BarChart3, Wand2, Shield, Layers } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Sparkles,
        title: 'Enhance',
        description: 'AI-driven prompt optimization engine.',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80',
        color: 'from-orange-600 to-amber-600',
    },
    {
        icon: BarChart3,
        title: 'Compare',
        description: 'Benchmark models side-by-side (GPT-4, Claude, Llama).',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
        color: 'from-violet-600 to-purple-600',
    },
    {
        icon: Target,
        title: 'Evaluate',
        description: 'Real-time quality scoring & cost analysis.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
        color: 'from-rose-600 to-orange-600',
    },
    {
        icon: Layers,
        title: 'Manage',
        description: 'Version-controlled prompt library & API.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
        color: 'from-blue-600 to-cyan-600',
    }
];

export default function FeaturesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const cards = cardsRef.current.filter(Boolean);

        // Pin the container
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: `+=${cards.length * 100}%`,
                    pin: true,
                    scrub: true,
                }
            });

            // Set initial state for valid cards (skip first)
            cards.forEach((card, i) => {
                if (i > 0) {
                    gsap.set(card, { y: '100%', scale: 0.9 + i * 0.02, zIndex: i });
                }
            });

            cards.forEach((card, i) => {
                if (i === 0) return;

                tl.to(card, {
                    y: '0%',
                    scale: 1,
                    zIndex: i,
                    ease: 'none',
                    duration: 1
                });
            });
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="features" className="relative h-screen bg-black overflow-hidden">
            {/* Background - fixed */}
            <div className="absolute inset-0 bg-neutral-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent" />
            </div>

            {/* Cards Container */}
            <div className="relative h-full w-full flex items-center justify-center">
                {features.map((feature, i) => (
                    <div
                        key={i}
                        ref={(el) => { cardsRef.current[i] = el; }}
                        className="absolute inset-0 w-full h-full flex items-center justify-center p-6"
                        style={{ zIndex: i }}
                    >
                        {/* The Card */}
                        <div className="relative w-full max-w-[90vw] md:max-w-6xl h-[85vh] rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl overflow-hidden">
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <Image
                                    src={feature.image}
                                    alt=""
                                    className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 mix-blend-multiply`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
                                <div className="mb-auto flex justify-between items-start">
                                    <span className="text-[10rem] leading-none font-bold text-white/5 select-none font-geist-mono">
                                        0{i + 1}
                                    </span>
                                    <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <h2 className="text-[8vw] leading-[0.9] font-bold tracking-tighter text-white mb-4">
                                    {feature.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-zinc-400 max-w-xl font-light">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
