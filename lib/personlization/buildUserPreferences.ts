import { supabaseAdmin } from '../supabase';

export async function buildUserPreferencexs(userId: string) {
  // Fetch user prompts
  const { data: prompts, error } = await supabaseAdmin
    .from('prompts')
    .select('*')
    .eq('created_by', userId);

  if (error || !prompts) {
    console.error(error);
    return null;
  }

  // Prompt Types
  const typeCount: Record<string, number> = {};

  prompts.forEach((p: any) => {
    const type = p.prompt_type || 'general';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  const preferredPromptTypes = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  // Average Prompt Length
  const avgPromptLength =
    prompts.reduce((acc: number, p: any) => acc + (p.prompt_value?.length || 0), 0) /
    prompts.length;

  // Verbosity Detection
  let verbosity = 'balanced';

  if (avgPromptLength > 700) {
    verbosity = 'detailed';
  } else if (avgPromptLength < 200) {
    verbosity = 'concise';
  }

  // Format Preference
  const formatCounts: Record<string, number> = {};

  prompts.forEach((p: any) => {
    const format = p.output_format || 'raw';

    formatCounts[format] = (formatCounts[format] || 0) + 1;
  });

  const preferredOutputFormats = Object.entries(formatCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);

  // Tone Detection
  let tone = 'balanced';

  const combinedText = prompts
    .map((p: any) => p.prompt_value || '')
    .join(' ')
    .toLowerCase();

  if (
    combinedText.includes('architecture') ||
    combinedText.includes('system design') ||
    combinedText.includes('technical')
  ) {
    tone = 'technical';
  }

  if (combinedText.includes('creative') || combinedText.includes('story')) {
    tone = 'creative';
  }

  // Save Preference
  const payload = {
    user_id: userId,

    preferred_prompt_types: preferredPromptTypes,

    preferred_output_formats: preferredOutputFormats,

    verbosity,

    tone,

    avg_prompt_length: Math.round(avgPromptLength),

    personalization_json: {
      type_counts: typeCount,
      format_counts: formatCounts,
    },

    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabaseAdmin.from('user_preferences').upsert(payload);

  if (upsertError) {
    console.error(upsertError);
    return null;
  }

  return payload;
}
