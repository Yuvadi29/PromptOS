import { supabaseAdmin } from '@/lib/supabase';

export interface SubmitAnonymousFeedbackInput {
  response: string;
  feedback: boolean;
}

export async function submitAnonymousFeedback({
  response,
  feedback,
}: SubmitAnonymousFeedbackInput) {
  if (typeof feedback !== 'boolean') {
    throw new Error('Invalid feedback type');
  }

  const { error: insertError } = await supabaseAdmin.from('prompt_feedback').insert({
    prompt: response,
    feedback: feedback,
  });

  if (insertError) {
    console.error('Insert error:', insertError);
    throw new Error('Error saving feedback');
  }

  return { success: true };
}
