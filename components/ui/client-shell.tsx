'use client';

import SmoothScrollProvider from '@/components/ui/smooth-scroll-provider';

export default function ClientShell({ children }: { children: React.ReactNode }) {
    return (
        <SmoothScrollProvider>
            {children}
        </SmoothScrollProvider>
    );
}
