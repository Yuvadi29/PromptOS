"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, Trophy, ArrowRight } from "lucide-react";

const phases = [
    {
        id: 1,
        title: "Phase 1: Draft",
        description: "Start with a raw idea. Our AI analyzes your intent and structure.",
        icon: Sparkles,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
    },
    {
        id: 2,
        title: "Phase 2: Refine",
        description: "Iterate with precision. Get real-time suggestions to enhance clarity and context.",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },
    {
        id: 3,
        title: "Phase 3: Perfect",
        description: "Achieve the optimal prompt. Score high on all metrics and deploy with confidence.",
        icon: Trophy,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
    },
];

const PhaseCard = ({ phase, index }: { phase: typeof phases[0]; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
            className={cn(
                "relative flex flex-col items-start p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]",
                "bg-card/50 hover:bg-card/80",
                phase.border
            )}
        >
            <div className={cn("p-3 rounded-2xl mb-6", phase.bg, phase.color)}>
                <phase.icon className="w-8 h-8" />
            </div>

            <h3 className="text-3xl font-bold mb-3 tracking-tight text-foreground">
                {phase.title}
            </h3>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
                {phase.description}
            </p>

            <div className="mt-auto flex items-center gap-2 text-sm font-medium text-primary cursor-pointer group">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>

            {/* Decorative gradient blob */}
            <div
                className={cn(
                    "absolute -z-10 top-1/2 right-1/2 w-32 h-32 rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2",
                    phase.bg.replace("/10", "")
                )}
            />
        </motion.div>
    );
};

export default function Phases() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                        The Enhancement Process
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Transform your prompts from simple text to powerful instructions in three simple steps.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />

                    {phases.map((phase, index) => (
                        <PhaseCard key={phase.id} phase={phase} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
