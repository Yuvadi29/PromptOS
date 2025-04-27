import SideBar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const user = session?.user;


  return (
    <main className="p-8 ">
      <h1 className="text-3xl font-bold mb-4 flex justify-center items-center">Welcome Back, {user?.name?.split(" ")[0]} 👋</h1>

      <p className="text-gray-600 mb-6 justify-center items-center flex">Let's get started on Enhancing your Prompts.</p>

      <SidebarProvider>
        <SideBar />
      </SidebarProvider>

    </main>
  );
}

