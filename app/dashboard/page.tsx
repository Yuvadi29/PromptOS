import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardCard } from "../../components/DashboardCard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const user = session?.user;


  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome Back, {user?.name?.split(" ")[0]} 👋</h1>

      <p className="text-gray-600 mb-6">Here's what you can do:</p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Prompt Enhancer"
          desc="Rewrite and optimize prompts using Gemini."
          href="/dashboard/enhancer"
        />
        <DashboardCard
          title="LLM Output Comparison"
          desc="Compare outputs from GPT-4, Claude, Gemini."
          href="/dashboard/comparison"
        />
        <DashboardCard
          title="Prompt Library"
          desc="Save and organize your enhanced prompts."
          href="/dashboard/library"
        />
      </div>
    </main>
  );
}

