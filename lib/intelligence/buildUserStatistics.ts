import { supabaseAdmin } from '@/lib/supabase';
import { generateUserSuggestions, Suggestion } from './calculatePatterns';

export async function getUserSuggestions(userId: string): Promise<Suggestion[]> {
  // Fetch prompts created by the user
  const { data: prompts, error: promptsError } = await supabaseAdmin
    .from('prompts')
    .select('id, prompt_value')
    .eq('created_by', userId);

  if (promptsError || !prompts || prompts.length === 0) {
    return generateUserSuggestions([], []);
  }

  // Fetch prompt intelligence for these prompts
  const promptIds = prompts.map((p: any) => p.id);

  const { data: intelligenceData, error: intelligenceError } = await supabaseAdmin
    .from('prompt_intelligence')
    .select('*')
    .in('prompt_id', promptIds);

  if (intelligenceError) {
    console.error('Error fetching prompt intelligence:', intelligenceError);
    return generateUserSuggestions(prompts, []);
  }

  return generateUserSuggestions(prompts, intelligenceData || []);
}
