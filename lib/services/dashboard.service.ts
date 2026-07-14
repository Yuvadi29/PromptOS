import { supabaseAdmin } from '@/lib/supabase';
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns';
import { getUserStreak } from '@/lib/streaks';
import { getUserSuggestions } from '@/lib/intelligence/buildUserStatistics';

export async function getDashboardStats(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Parallel data fetching for performance
  const [promptsRes, scoresRes, streakCount, suggestions] = await Promise.all([
    supabaseAdmin
      .from('prompts')
      .select('*', { count: 'exact' })
      .eq('created_by', userId)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('prompt_scores')
      .select('*', { count: 'exact' })
      .eq('created_by', userId)
      .order('created_at', { ascending: false }),
    getUserStreak(userId),
    getUserSuggestions(userId),
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
    end: endOfWeek(subWeeks(now, 1)),
  };

  const promptsThisWeek = prompts.filter((p: any) =>
    isWithinInterval(new Date(p.created_at), thisWeek)
  );

  const promptsLastWeek = prompts.filter((p: any) =>
    isWithinInterval(new Date(p.created_at), lastWeek)
  );

  const promptDelta = promptsThisWeek.length - promptsLastWeek.length;

  return {
    promptCount,
    prompts,
    promptScores,
    promptDelta,
    streakCount,
    suggestions,
  };
}

export async function getGlobalMetrics() {
  const { count: usersCount } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: promptsCount } = await supabaseAdmin
    .from('prompts')
    .select('*', { count: 'exact', head: true });

  const { data: typesData } = await supabaseAdmin.from('prompts').select('prompt_type');

  const uniqueTypes = new Set(typesData?.map((p) => p.prompt_type).filter(Boolean));
  const typesCount = Math.max(uniqueTypes.size, 10);

  return {
    usersCount,
    promptsCount,
    typesCount,
  };
}
