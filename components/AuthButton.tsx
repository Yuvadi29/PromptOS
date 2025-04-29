"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="flex items-center gap-4 cursor-pointer">
                <p className="text-sm">Welcome, {session?.user?.name}</p>
                <Button variant={"secondary"} onClick={() => signOut()} className="p-6 cursor-pointer ">Sign Out</Button>
            </div>
        );
    }

    return (
        <Button onClick={() => signIn("google")} className="cursor-pointer p-6 text-base">Sign in with Google</Button>
    )
}