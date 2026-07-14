import { supabaseAdmin } from '@/lib/supabase';
import { differenceInDays, parseISO, format, subDays } from 'date-fns';

export async function getPublicActivities() {
  const { data, error } = await supabaseAdmin
    .from('user_activity_log')
    .select('action, created_at')
    .order('created_at', { ascending: false })
    .limit(15);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getUserActivities(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_activity_log')
    .select('action, created_at, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(2000);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getUserBio(userId: string) {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('bio')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return { bio: user?.bio || '' };
}

export async function updateUserBio(userId: string, bio: string) {
  if (typeof bio !== 'string') {
    throw new Error('Invalid bio');
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ bio: bio.slice(0, 2000) })
    .eq('id', userId);

  if (error) throw new Error(error.message);

  return { message: 'Bio updated' };
}

export async function updateUserProfile(userId: string, data: any) {
  const { bio, location, job_title, social_links } = data;

  const { error } = await supabaseAdmin
    .from('users')
    .update({
      bio,
      location,
      job_title,
      social_links,
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);

  return { success: true };
}

export async function getUserProfileStats(userId: string) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, created_at, name, image, bio, location, job_title, social_links')
    .eq('id', userId)
    .single();

  if (!user) throw new Error('User not found');

  const sevenDaysAgo = subDays(new Date(), 7).toISOString();

  const [
    promptsResult,
    activitiesResult,
    streakResult,
    libraryPromptsResult,
    weeklyActivitiesResult,
    topPromptResult,
    recentActivitiesResult,
  ] = await Promise.all([
    supabaseAdmin.from('prompts').select('id').eq('created_by', user.id),
    supabaseAdmin
      .from('user_activity_log')
      .select('action, metadata, created_at')
      .eq('user_id', user.id),
    supabaseAdmin
      .from('user_streaks')
      .select('current_streak, last_active_date')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabaseAdmin
      .from('prompt_library')
      .select('id, prompt_title, niche, likes, dislikes')
      .eq('created_by', user.id),
    supabaseAdmin
      .from('user_activity_log')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: true }),
    supabaseAdmin
      .from('prompt_library')
      .select('id, prompt_title, prompt_description, niche, likes, dislikes')
      .eq('created_by', user.id)
      .order('likes', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from('user_activity_log')
      .select('action, metadata, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const prompts = promptsResult.data || [];
  const activities = activitiesResult.data || [];
  const totalPrompts = prompts.length;

  const breakdown = [
    { subject: 'Prompt Library', A: 0, fullMark: 100 },
    { subject: 'Enhancement', A: 0, fullMark: 100 },
    { subject: 'LLM Comparison', A: 0, fullMark: 100 },
    { subject: 'Scoring', A: 0, fullMark: 100 },
  ];

  activities.forEach((act) => {
    if (act.action === 'prompt_library_added') breakdown[0].A += 10;
    else if (act.action === 'prompt_enhanced') breakdown[1].A += 10;
    else if (act.action === 'llm_compared') breakdown[2].A += 10;
    else if (act.action === 'prompt_scored') breakdown[3].A += 10;
  });

  const maxVal = Math.max(...breakdown.map((l) => l.A));
  if (maxVal > 100) {
    breakdown.forEach((l) => (l.A = Math.round((l.A / maxVal) * 100)));
  }

  let currentStreak = 0;
  if (streakResult.data) {
    const streakData = streakResult.data;
    if (streakData.last_active_date) {
      const todayDate = parseISO(format(new Date(), 'yyyy-MM-dd'));
      const lastActiveDate = parseISO(streakData.last_active_date);
      const daysDiff = differenceInDays(todayDate, lastActiveDate);
      currentStreak = daysDiff <= 1 ? streakData.current_streak : 0;
    }
  }

  const nicheCounts: Record<string, number> = {};
  (libraryPromptsResult.data || []).forEach((p: any) => {
    if (p.niche) {
      nicheCounts[p.niche] = (nicheCounts[p.niche] || 0) + 1;
    }
  });
  const mostUsedNiche = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const weeklySparkline: number[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = format(subDays(today, i), 'yyyy-MM-dd');
    const count = (weeklyActivitiesResult.data || []).filter((a: any) => {
      const actDay = format(new Date(a.created_at), 'yyyy-MM-dd');
      return actDay === day;
    }).length;
    weeklySparkline.push(count);
  }

  const topPrompt = topPromptResult.data
    ? {
        id: topPromptResult.data.id,
        title: topPromptResult.data.prompt_title,
        description: topPromptResult.data.prompt_description,
        niche: topPromptResult.data.niche,
        likes: topPromptResult.data.likes || 0,
        dislikes: topPromptResult.data.dislikes || 0,
      }
    : null;

  const ACTION_LABELS: Record<string, string> = {
    prompt_enhanced: 'Enhanced a prompt',
    llm_compared: 'Compared LLMs',
    prompt_scored: 'Scored a prompt',
    prompt_library_added: 'Added to library',
  };

  const recentActivity = (recentActivitiesResult.data || []).map((a: any) => ({
    action: a.action,
    label: ACTION_LABELS[a.action] || a.action,
    metadata: a.metadata,
    createdAt: a.created_at,
  }));

  const memberSince = user.created_at || null;
  const totalComparisons = activities.filter((a) => a.action === 'llm_compared').length;

  return {
    user: {
      id: user.id,
      name: user.name,
      image: user.image,
      bio: user.bio,
      location: user.location,
      job_title: user.job_title,
      social_links: user.social_links,
    },
    totalPrompts,
    activityBreakdown: breakdown,
    currentStreak,
    mostUsedNiche,
    weeklySparkline,
    topPrompt,
    recentActivity,
    memberSince,
    totalComparisons,
  };
}
