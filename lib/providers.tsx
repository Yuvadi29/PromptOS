'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function SessionSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (session?.user) {
        sessionStorage.setItem('user_credentials', JSON.stringify(session.user));
      } else {
        sessionStorage.removeItem('user_credentials');
      }
    }
  }, [session]);

  return null;
}

export function Providers({ children, session }: { children: React.ReactNode; session?: any }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
