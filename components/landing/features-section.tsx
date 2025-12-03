'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, MessageSquare, BarChart3, Users, FileText, Code, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

const features = [
    {
        icon: Zap,
        title: 'Instant Enhancement',
        description: 'Transform vague prompts into precise, effective instructions with AI-powered analysis.',
        gradient: 'from-orange-500 to-amber-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
    },
    {
        icon: MessageSquare,
        title: 'Multi-Model Comparison',
        description: 'Compare outputs from GPT-4, Claude, and Gemini side-by-side to find the best results.',
        gradient: 'from-amber-500 to-yellow-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
    },
    {
        icon: BarChart3,
        title: 'Smart Scoring',
        description: 'Get real-time effectiveness scores based on clarity, specificity, and model compatibility.',
        gradient: 'from-yellow-500 to-orange-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
    },
    {
        icon: Users,
        title: 'Collaborative Feedback',
        description: 'Share prompts, collect feedback, and learn from community-driven improvements.',
        gradient: 'from-orange-400 to-red-500',
        bg: 'bg-orange-400/10',
        border: 'border-orange-400/20',
    },
    {
        icon: FileText,
        title: 'Organized Library',
        description: 'Save and categorize your best prompts by domain: code, design, marketing, and more.',
        gradient: 'from-red-500 to-orange-600',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
    },
    {
        icon: Code,
        title: 'Developer-First',
        description: 'Built with modern tech stack and designed for seamless integration into your workflow.',
        gradient: 'from-orange-600 to-amber-600',
        bg: 'bg-orange-600/10',
        border: 'border-orange-600/20',
    },
];

const FeatureCard = ({ feature, index, range, targetScale }: any) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
    const scale = useTransform(scrollYProgress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5% + ${index * 25}px)` }}
                className={cn(
                    "relative flex flex-col items-center justify-center p-12 rounded-3xl border backdrop-blur-xl w-full max-w-4xl mx-auto h-[500px] shadow-2xl origin-top",
                    "bg-card/90",
                    feature.border
                )}
            >
                {/* Background Gradient Blob */}
                <div className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 pointer-events-none",
                    feature.bg.replace('/10', '')
                )} />

                <div className={cn(
                    "p-4 rounded-2xl mb-8",
                    feature.bg
                )}>
                    <feature.icon className="w-12 h-12 text-foreground" />
                </div>

                <h3 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {feature.title}
                </h3>

                <p className="text-xl text-muted-foreground text-center max-w-2xl leading-relaxed">
                    {feature.description}
                </p>

                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r opacity-50 rounded-b-3xl",
                    feature.gradient
                )} />
            </motion.div>
        </div>
    )
}

export default function FeaturesSection() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    return (
        <section ref={container} className="relative bg-background">
            <div className="container px-4 mx-auto py-24">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Core Features</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Everything You Need to
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Master Prompt Engineering
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Powerful tools designed to elevate your AI interactions and boost productivity
                    </p>
                </motion.div>

                {/* Stacking Cards */}
                <div className="mt-20">
                    {features.map((feature, index) => {
                        const targetScale = 1 - ((features.length - index) * 0.05);
                        return (
                            <FeatureCard
                                key={index}
                                feature={feature}
                                index={index}
                                range={[index * 0.25, 1]}
                                targetScale={targetScale}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
