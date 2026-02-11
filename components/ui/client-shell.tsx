'use client';

import dynamic from 'next/dynamic';
import SmoothScrollProvider from '@/components/ui/smooth-scroll-provider';
import ScrollProgress from '@/components/ui/scroll-progress';
import NavRail from '@/components/ui/nav-rail';

const CustomCursor = dynamic(() => import('@/components/ui/custom-cursor'), {
    ssr: false,
});

export default function ClientShell({ children }: { children: React.ReactNode }) {
    return (
        <SmoothScrollProvider>
            <CustomCursor />
            <div className="grain-overlay" />
            <ScrollProgress />
            <NavRail />
            {children}
        </SmoothScrollProvider>
    );
}
