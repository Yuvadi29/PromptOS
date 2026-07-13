import { supabaseAdmin } from '@/lib/supabase';

export interface SubmitFeedbackInput {
  userId: string;
  response: string;
  feedback: boolean;
}

export async function submitFeedback({ userId, response, feedback }: SubmitFeedbackInput) {
  if (!userId) {
    throw new Error('Unauthorized: User ID is required');
  }

  if (typeof feedback !== 'boolean') {
    throw new Error('Invalid feedback type');
  }

  // Prevent duplicate feedback
  const { data: existing } = await supabaseAdmin
    .from('prompt_feedback')
    .select('id')
    .eq('user_id', userId)
    .eq('prompt', response)
    .single();

  if (existing) {
    throw new Error('Feedback already submitted');
  }

  const { error: insertError } = await supabaseAdmin.from('prompt_feedback').insert({
    user_id: userId,
    prompt: response,
    feedback: feedback,
  });

  if (insertError) {
    console.error('Insert error:', insertError);
    throw new Error('Error saving feedback');
  }

  // Track stats & Check badges
  const { incrementUserStat } = await import('@/lib/user-stats');
  const newBadges = await incrementUserStat(userId, 'feedback_given');

  return { newBadges };
}
