'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import('@/components/three/hero-scene'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-zinc-950" />,
});

const words = ['Analyze', 'Optimize', 'Deploy', 'Scale'];

function TypewriterText() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="relative inline-flex flex-col h-[1em] overflow-hidden align-bottom">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={index}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

import { AnimatePresence } from 'framer-motion';

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950"
            style={{ perspective: '1000px' }}
        >
            {/* 3D Background - Parallaxed */}
            <motion.div
                ref={sceneRef}
                className="absolute inset-0 z-0"
                style={{ y, scale, opacity: useTransform(scrollYProgress, [0, 0.8], [1, 0]) }}
            >
                <HeroScene />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.8)_100%)]" />
            </motion.div>

            {/* Massive Typography Content */}
            <motion.div
                ref={textRef}
                className="relative z-10 w-full px-6 flex flex-col items-center text-center mix-blend-difference"
                style={{ opacity, scale }}
            >
                {/* Status Pill */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-300">
                        System Operational
                    </span>
                </motion.div>

                {/* The "Main Event" Text */}
                <h1 className="text-[12vw] leading-[0.85] font-bold tracking-tighter text-white mb-6 select-none">
                    <motion.div
                        initial={{ y: '100%', rotateX: -20, opacity: 0 }}
                        animate={{ y: 0, rotateX: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        SUPER
                    </motion.div>
                    <div className="inline-block relative">
                        <TypewriterText />
                    </div>
                </h1>

                {/* Subtext & CTA */}
                <div className="flex flex-col items-center gap-8 mt-8">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-xl font-light tracking-wide"
                    >
                        The enterprise operating system for prompt engineering and LLM evaluation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex items-center gap-6"
                    >
                        <div className="scale-125"><AuthButton /></div>
                        <div className="h-px w-12 bg-white/20" />
                        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">v1.0.0</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-10 flex items-center gap-4 mix-blend-difference z-20"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 -rotate-90 origin-left translate-x-4">
                    Scroll
                </span>
            </motion.div>
        </section>
    );
}
