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
    <SidebarProvider>
      <div className="border border-red-400">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-white">
          <SideBar />
        </div>

        <main className=" flex  flex-col flex-1 items-center justify-center p-4 border-2 border-green-600 w-screen ">
          <h1 className="text-3xl font-bold mb-4 justify-center w-full max-w-4xl space-y-8 items-center text-center">Welcome Back, {user?.name?.split(" ")[0]} 👋</h1>

          <p className="text-gray-600 mb-6 justify-center items-center flex">Let's get started on Enhancing your Prompts.</p>

        </main>
      </div>
    </SidebarProvider>

  );
}

