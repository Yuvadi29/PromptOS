import { classifyPrompt } from '@/lib/prompt-classifier';
import { supabaseAdmin } from '../supabase';
import { calculateComplexity } from './calculateComplexity';
import {
  calculateClarity,
  calculateSpecificity,
  calculateStructure,
  detectOutputFormat,
  extractTags,
} from './metrics';

export async function buildPromptIntelligence(promptId: number) {
  // Loading the prompt
  const { data: prompt, error } = await supabaseAdmin
    .from('prompts')
    .select('id, prompt_value')
    .eq('id', promptId)
    .single();

  if (error || !prompt) {
    throw new Error('Prompt not Found');
  }

  // Classification
  const classification = await classifyPrompt(prompt.prompt_value);

  // Complexity
  const complexity = calculateComplexity(prompt.prompt_value);

  // Intelligence object
  const intelligence = {
    prompt_id: prompt.id,

    prompt_type: classification.type,

    detected_intent: classification.type,

    output_format: detectOutputFormat(prompt.prompt_value),

    complexity_score: complexity,

    clarity_score: calculateClarity(prompt.prompt_value),

    specificity_score: calculateSpecificity(prompt.prompt_value),

    structure_score: calculateStructure(prompt.prompt_value),

    personalization_tags: extractTags(prompt.prompt_value),

    metadata: {
      classifier: classification.source,
    },
  };

  // Save
  const { error: saveError } = await supabaseAdmin.from('prompt_intelligence').upsert(intelligence);

  if (saveError) throw saveError;

  return intelligence;
}
