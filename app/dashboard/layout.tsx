import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/lib/providers";
import { SidebarProvider } from "@/components/ui/sidebar";
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
              <div className="flex h-screen w-screen">
                <SideBar user={user} />
                <main className="flex-1 overflow-y-auto">
                  <Toaster position="top-right" richColors />
                  {children}
                </main>
              </div>
            </UserProvider>
          </SidebarProvider>
        </Providers>
      </div>
  );
}
