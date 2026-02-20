import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/lib/providers";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserContext";
import SideBar from "@/components/SideBar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { redirect } from "next/navigation";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
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
      <Providers>
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
      </Providers>
    </div>
  );
}
