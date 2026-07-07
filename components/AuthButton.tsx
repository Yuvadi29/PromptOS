'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface AuthButtonProps {
  isMobile?: boolean;
}

export function AuthButton({ isMobile = false }: AuthButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  if (session) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full justify-center bg-foreground hover:bg-foreground/90 text-background font-medium py-2 rounded-lg cursor-pointer"
          >
            Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="w-full justify-center border-border bg-card/50 hover:bg-card text-foreground cursor-pointer"
          >
            Sign Out
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.push('/dashboard')}
          size="sm"
          className="bg-foreground hover:bg-foreground/90 text-background font-medium cursor-pointer"
        >
          Dashboard
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Button
          variant="ghost"
          onClick={handleLogin}
          className="w-full justify-start text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Sign in
        </Button>
        <Button
          onClick={handleLogin}
          className="w-full justify-center bg-foreground hover:bg-foreground/90 text-background font-medium py-2 rounded-lg cursor-pointer"
        >
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogin}
        className="text-muted-foreground hover:text-foreground cursor-pointer"
      >
        Sign in
      </Button>
      <Button
        size="sm"
        onClick={handleLogin}
        className="bg-foreground hover:bg-foreground/90 text-background cursor-pointer"
      >
        Get Started
      </Button>
    </div>
  );
}
