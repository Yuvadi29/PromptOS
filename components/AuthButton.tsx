"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function AuthButton() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogin = async () => {
        signIn("google");
        router.push('/dashboard');
    };

    if (session) {
        return (
            <>
                <div className="flex items-center gap-4 cursor-pointer">
                <Button variant={"secondary"} onClick={() => signOut()} className="p-6 cursor-pointer ">Sign Out</Button>
                </div>

                {/* <h2 className="text-lg text-left flex">Welcome, {session?.user?.name}</h2> */}

            </>
        );
    }

    return (
        <Button onClick={handleLogin} className="cursor-pointer p-6 text-base">Sign in with Google</Button>
    )
}