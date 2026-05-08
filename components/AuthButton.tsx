'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthButtonProps {
  isScrolled?: boolean;
}

export function AuthButton({ isScrolled }: AuthButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className={`text-sm font-medium transition-colors duration-300 cursor-pointer ${
            isScrolled
              ? 'text-foreground/70 hover:text-foreground'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => signOut()}
          className={`text-[10px] px-3 py-1 rounded-full border transition-all duration-300 uppercase tracking-widest font-bold cursor-pointer ${
            isScrolled
              ? 'border-foreground/10 text-foreground/40 hover:border-foreground/20 hover:text-foreground/60'
              : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
          }`}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className={`text-sm font-medium transition-colors duration-300 cursor-pointer ${
        isScrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'
      }`}
    >
      Sign In
    </button>
  );
}
