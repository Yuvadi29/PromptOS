'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Input Your Prompt',
        description: 'Start with any prompt - whether it\'s for code, content, or creative work.',
        color: 'from-orange-500 to-amber-500',
    },
    {
        number: '02',
        title: 'AI Enhancement',
        description: 'Our Gemini-powered engine analyzes and enhances your prompt for maximum clarity.',
        color: 'from-amber-500 to-yellow-500',
    },
    {
        number: '03',
        title: 'Compare & Score',
        description: 'See before/after results, compare model outputs, and get effectiveness scores.',
        color: 'from-yellow-500 to-orange-400',
    },
    {
        number: '04',
        title: 'Save & Iterate',
        description: 'Store your best prompts, gather feedback, and continuously improve your library.',
        color: 'from-orange-400 to-red-500',
    },
];

export default function HowItWorks() {
    return (
        <section className="relative py-24 bg-background">
            <div className="container px-4 mx-auto">
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
                        <span className="text-sm font-medium text-primary">Simple Process</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                            How PromptOS
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Works For You
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Four simple steps to transform your prompts and boost your productivity
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative mb-12 last:mb-0"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Number Badge */}
                                <div className="relative flex-shrink-0">
                                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} p-[2px]`}>
                                        <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                                            <span className={`text-3xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                                                {step.number}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Connecting line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-12 bg-gradient-to-b from-border to-transparent" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow (desktop only) */}
                                {index < steps.length - 1 && (
                                    <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground flex-shrink-0" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
