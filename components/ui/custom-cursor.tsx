"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const dotX = useSpring(cursorX, springConfig);
    const dotY = useSpring(cursorY, springConfig);

    const ringConfig = { damping: 30, stiffness: 200, mass: 0.8 };
    const ringX = useSpring(cursorX, ringConfig);
    const ringY = useSpring(cursorY, ringConfig);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        },
        [cursorX, cursorY, isVisible]
    );

    useEffect(() => {
        // Detect touch device
        const isTouch =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(isTouch);
        if (isTouch) return;

        window.addEventListener("mousemove", handleMouseMove);

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        // Detect hoverable elements
        const handleOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest("a, button, [data-cursor='pointer'], input, textarea, select, [role='button']")
            ) {
                setIsHovering(true);
            }
        };
        const handleOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest("a, button, [data-cursor='pointer'], input, textarea, select, [role='button']")
            ) {
                setIsHovering(false);
            }
        };

        document.addEventListener("mouseover", handleOver);
        document.addEventListener("mouseout", handleOut);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseover", handleOver);
            document.removeEventListener("mouseout", handleOut);
        };
    }, [handleMouseMove]);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Hide default cursor via style tag */}
            <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

            {/* Dot */}
            <motion.div
                className="fixed top-0 left-0 z-[99999] pointer-events-none mix-blend-difference"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovering ? 40 : 8,
                    height: isHovering ? 40 : 8,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <div className="w-full h-full rounded-full bg-orange-500" />
            </motion.div>

            {/* Ring */}
            <motion.div
                className="fixed top-0 left-0 z-[99998] pointer-events-none"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovering ? 60 : 36,
                    height: isHovering ? 60 : 36,
                    opacity: isVisible ? 0.5 : 0,
                    borderColor: isHovering
                        ? "rgba(249, 115, 22, 0.6)"
                        : "rgba(249, 115, 22, 0.25)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="w-full h-full rounded-full border border-orange-500/30" />
            </motion.div>
        </>
    );
}
