'use client';

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface LoginButtonProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LoginButton({ children, className, variant }: LoginButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleAction = async () => {
        if (session) {
            router.push('/dashboard');
        } else {
            await signIn("google", { callbackUrl: '/dashboard' });
        }
    };

    return (
        <Button variant={variant} className={className} onClick={handleAction} disabled={status === "loading"}>
            {status === "loading" ? "..." : children}
        </Button>
    );
}
