import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { UserProvider } from '@/context/UserContext';
import SideBar from '@/components/SideBar';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  // Lazy-backfill user location details if they are missing
  if (session.user?.email) {
    try {
      const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('country')
        .eq('email', session.user.email)
        .single();

      if (dbUser && !dbUser.country) {
        const headersList = await headers();
        const country = headersList.get('x-vercel-ip-country') || 'Unknown';
        const region = headersList.get('x-vercel-ip-country-region') || 'Unknown';
        const city = headersList.get('x-vercel-ip-city') || 'Unknown';

        await supabaseAdmin
          .from('users')
          .update({ country, region, city })
          .eq('email', session.user.email);
      }
    } catch (err) {
      console.warn('Failed to lazy-backfill user location details:', err);
    }
  }

  const user = session?.user
    ? {
        name: session.user.name ?? undefined,
        email: session.user.email ?? undefined,
        image: session.user.image ?? undefined,
      }
    : undefined;

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SidebarProvider>
        <UserProvider user={user}>
          <SideBar user={user} />
          <SidebarInset className="bg-zinc-950 flex-1 h-screen overflow-y-auto">
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-950 px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="text-zinc-400 hover:text-white" />
              </div>
            </header>
            <div className="flex flex-1 flex-col">
              <Toaster position="top-right" richColors />
              {children}
            </div>
          </SidebarInset>
        </UserProvider>
      </SidebarProvider>
    </div>
  );
}
