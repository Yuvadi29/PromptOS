'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9998] h-[2px] bg-zinc-900/50">
            <div
                className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 transition-[width] duration-100 ease-out"
                style={{ width: `${progress * 100}%` }}
            />
        </div>
    );
}
