"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function AuthButton() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogin = async () => {
        // Use NextAuth's built-in redirect with callbackUrl
        await signIn("google", { callbackUrl: '/dashboard' });
    };

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => router.push('/dashboard')}
                    className="group relative px-8 py-6 text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 text-white border-0"
                >
                    Go to Dashboard
                </Button>
                <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="px-8 py-6 text-lg font-semibold border-border bg-card/50 hover:bg-card text-foreground backdrop-blur-sm"
                >
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={handleLogin} className="cursor-pointer p-6 text-base group relative px-8 py-6 text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 text-white border-0">Get Started</Button>
    )
}