import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";
import { DashboardClient } from "./DashboardClient";
import { getUserStreak } from "@/lib/streaks";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  // Fetch User ID
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single();

  if (!userData?.id) {
    redirect("/");
  }

  const userId = userData.id;

  // Parallel data fetching for performance
  const [promptsRes, scoresRes, streakCount] = await Promise.all([
    supabaseAdmin
      .from("prompts")
      .select('*', { count: 'exact' })
      .eq('created_by', userId)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from("prompt_scores")
      .select('*', { count: 'exact' })
      .eq('created_by', userId)
      .order('created_at', { ascending: false }),
    getUserStreak(userId)
  ]);

  const prompts = promptsRes.data || [];
  const promptCount = promptsRes.count || 0;
  const promptScores = scoresRes.data || [];

  // Calculate Delta
  const now = new Date();
  const thisWeek = {
    start: startOfWeek(now),
    end: endOfWeek(now),
  };

  const lastWeek = {
    start: startOfWeek(subWeeks(now, 1)),
    end: endOfWeek(subWeeks(now, 1))
  };

  const promptsThisWeek = prompts.filter((p: any) =>
    isWithinInterval(new Date(p.created_at), thisWeek)
  );

  const promptsLastWeek = prompts.filter((p: any) =>
    isWithinInterval(new Date(p.created_at), lastWeek)
  );

  const promptDelta = promptsThisWeek.length - promptsLastWeek.length;

  return (
    <DashboardClient
      promptCount={promptCount}
      prompts={prompts}
      promptScores={promptScores}
      promptDelta={promptDelta}
      streakCount={streakCount}
    />
  );
}
