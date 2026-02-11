'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
    { id: 'hero', label: 'Start' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'process' },
    { id: 'phases', label: 'Roadmap' },
    { id: 'cta', label: 'Join' },
];

export default function NavRail() {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[9999] flex flex-col items-center gap-4 mix-blend-difference">
            {sections.map(({ id, label }) => (
                <a
                    key={id}
                    href={`#${id}`}
                    className="group relative flex items-center justify-center w-4 h-4"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    {/* Label Tooltip */}
                    <span
                        className={`absolute right-8 text-[10px] font-medium uppercase tracking-widest transition-all duration-300 ${activeSection === id
                                ? 'opacity-100 translate-x-0 text-white'
                                : 'opacity-0 translate-x-2 text-zinc-500 group-hover:opacity-100 group-hover:translate-x-0'
                            }`}
                    >
                        {label}
                    </span>

                    {/* Dot */}
                    <div
                        className={`rounded-full transition-all duration-500 ${activeSection === id
                                ? 'w-2 h-2 bg-orange-500 scale-125'
                                : 'w-1.5 h-1.5 bg-zinc-600 group-hover:bg-zinc-400 group-hover:scale-110'
                            }`}
                    />

                    {/* Active Ring */}
                    {activeSection === id && (
                        <motion.div
                            layoutId="nav-ring"
                            className="absolute inset-0 rounded-full border border-orange-500/50"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 2.5, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </a>
            ))}
        </div>
    );
}
