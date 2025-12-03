'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="relative py-24 overflow-hidden bg-background">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="container relative z-10 px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Start Your Journey</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Ready to Transform
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                            Your AI Workflow?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of developers who are already using PromptOS to create better prompts,
                        faster results, and more effective AI interactions.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div className="transform scale-110">
                            <AuthButton />
                        </div>
                        <Link href="/docs">
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-6 text-lg font-semibold border-border bg-card/50 hover:bg-card text-foreground backdrop-blur-sm cursor-pointer"
                        >
                            View Documentation
                        </Button>   
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 pt-8 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-4">Trusted by developers at</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                            <div className="text-2xl font-bold text-muted-foreground">Google</div>
                            <div className="text-2xl font-bold text-muted-foreground">Microsoft</div>
                            <div className="text-2xl font-bold text-muted-foreground">Amazon</div>
                            <div className="text-2xl font-bold text-muted-foreground">Meta</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
