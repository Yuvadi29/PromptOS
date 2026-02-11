"use client";

import { motion } from "framer-motion";

export const BackgroundGrid = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
            {/* Base Grid */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c20_1px,transparent_1px),linear-gradient(to_bottom,#ea580c20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />

            {/* Secondary Finer Grid */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c10_1px,transparent_1px),linear-gradient(to_bottom,#ea580c10_1px,transparent_1px)] bg-[size:1rem_1rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />

            {/* Ambient Glows */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-[100px]"
            />

            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-[100px]"
            />

            {/* Scanline Effect (subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] opacity-10 pointer-events-none" />
        </div>
    );
};
