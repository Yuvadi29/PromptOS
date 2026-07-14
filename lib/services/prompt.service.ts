import { supabaseAdmin } from '@/lib/supabase';
import { updateUserStreak, logActivityAndCalculateStreak } from '@/lib/streaks';
import { incrementUserStat } from '@/lib/user-stats';
import OpenAI from 'openai';
import { embedText } from '@/lib/embedding';
import { generatePrompt as geminiGeneratePrompt } from '@/lib/gemini';
import { classifyPrompt as libClassifyPrompt } from '@/lib/prompt-classifier';

// ============================================================================
// Save Prompt (History)
// ============================================================================
export async function savePrompt(userId: string, prompt: string, originalPrompt: string) {
  if (!userId || !prompt) {
    throw new Error('Missing Data');
  }

  const { error } = await supabaseAdmin.from('prompts').insert({
    created_by: userId,
    prompt_value: prompt,
    original_prompt: originalPrompt,
  });

  if (error) {
    throw new Error(error.message);
  }

  await updateUserStreak(userId);
  return { ok: true };
}

// ============================================================================
// Save Prompt Score
// ============================================================================
export async function savePromptScore(userId: string, data: any) {
  if (!userId || !data.prompt) {
    throw new Error('Missing Data');
  }

  const { error } = await supabaseAdmin.from('prompt_scores').insert({
    created_by: userId,
    prompt: data.prompt,
    clarity: data.clarity,
    specificity: data.specificity,
    model_fit: data.model_fit,
    relevance: data.relevance,
    structure: data.structure,
    conciseness: data.conciseness,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true };
}

// ============================================================================
// Score Prompt with AI
// ============================================================================
export async function scorePrompt(prompt: string, userId?: string) {
  let newBadges: any[] = [];
  if (userId) {
    try {
      newBadges = await incrementUserStat(userId, 'prompt_scores_viewed');
      await logActivityAndCalculateStreak(userId, 'prompt_scored', { prompt });
    } catch (e) {
      console.error('Stats error', e);
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenRouter API Key');
  }

  const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
  });

  const systemPrompt = `You are an expert Prompt Quality Evaluator trained to assess the effectiveness of user-generated prompts for Large Language Models (LLMs) like Claude or GPT. Your task is to analyze a given prompt and return a strict JSON object with integer scores (1 to 10) across the following six categories:

1. Clarity: Is the prompt's intent clear and easy to understand?
2. Specificity: Does the prompt provide precise and actionable direction?
3. Model_Fit: Is the prompt optimized for generating high-quality results from modern LLMs?
4. Relevance: Does the prompt include all essential and contextually relevant details?
5. Structure: Is the prompt logically and grammatically well-organized?
6. Conciseness: Is the prompt free from unnecessary words or ambiguity?

You must also include one brief and actionable suggestion for improvement (if any), focusing on the lowest-scoring category.

🔁 Output Format (strict JSON only):
{
  "clarity": <1-10>,
  "specificity": <1-10>,
  "model_fit": <1-10>,
  "relevance": <1-10>,
  "structure": <1-10>,
  "conciseness": <1-10>,
  "tip": "<short-suggestion>"
}

🚫 Do not include explanations or extra commentary.
✅ Output only the JSON object.
📏 Ensure scores are whole numbers between 1 and 10.`;

  const completion = await openrouter.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: `${systemPrompt}\n\nUser Prompt:\n${prompt}` }],
  });

  const text = completion.choices[0]?.message?.content ?? '';
  const match = text.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error('No valid JSON in OpenRouter response');

  const raw = JSON.parse(match[0]);

  const criteriaScores = {
    clarity: raw?.clarity,
    specificity: raw?.specificity,
    model_fit: raw?.model_fit,
    relevance: raw?.relevance,
    structure: raw?.structure,
    conciseness: raw?.conciseness,
  };

  const total = Object.values(criteriaScores).reduce((sum: any, score: any) => sum + score, 0);
  const overallScore = Math.round((total / 60) * 100);

  return {
    overallScore,
    criteriaScores,
    feedback: raw.tip || 'Great work! No improvement needed.',
    newBadges,
  };
}

// ============================================================================
// Recommend Prompts
// ============================================================================
export async function recommendPrompts(data: any) {
  const {
    queryText,
    queryEmbedding,
    excludeId,
    limit = 6,
    createdBy,
    category,
    minSimilarity = 0.2,
  } = data;

  const embedding = queryEmbedding ?? (queryText ? await embedText(queryText) : null);
  if (!embedding) {
    throw new Error('queryText or queryEmbedding required');
  }

  const { data: dbData, error } = await supabaseAdmin.rpc('match_prompts', {
    query_embedding: embedding,
    match_count: limit + 3,
  });

  if (error) throw new Error(error.message);

  const filtered = dbData
    .filter((r: any) => (excludeId ? r?.id !== excludeId : true))
    .filter((r: any) => (createdBy ? r.created_by === createdBy : true))
    .filter((r: any) => (category ? r.category === category : true))
    .filter((r: any) => (r.similarity ?? 0) >= minSimilarity)
    .slice(0, limit);

  return filtered;
}

// ============================================================================
// Generate Prompt
// ============================================================================
export async function generatePrompt(input: string) {
  if (!input) throw new Error('Input is required');
  return geminiGeneratePrompt(input);
}

// ============================================================================
// Embed Prompt
// ============================================================================
export async function embedPrompt(promptId: string) {
  const { data: prompt, error } = await supabaseAdmin
    .from('prompts')
    .select('id,prompt_value')
    .eq('id', promptId)
    .single();

  if (error || !prompt) {
    throw new Error('Prompt not found');
  }

  const embedding = await embedText(prompt?.prompt_value);
  const { error: upErr } = await supabaseAdmin
    .from('prompts')
    .update({ embedding })
    .eq('id', prompt?.id);

  if (upErr) {
    throw new Error(upErr.message);
  }

  return { ok: true };
}

// ============================================================================
// Prompt Versions
// ============================================================================
export async function getPromptVersions(promptId: string) {
  const { data, error } = await supabaseAdmin
    .from('prompt_version_stats')
    .select('*')
    .eq('prompt_id', promptId)
    .order('version_number', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createPromptVersion(promptId: string, data: any) {
  const { content, source = 'user', reason = null, meta = {} } = data;
  if (!content) throw new Error('Content is required');

  const { data: newVer, error } = await supabaseAdmin
    .from('prompt_versions')
    .insert([{ prompt_id: promptId, content, source, reason, meta }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newVer;
}

export async function revertPromptVersion(promptId: string, versionId: string) {
  const { data: old, error: oldErr } = await supabaseAdmin
    .from('prompt_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (oldErr || !old) throw new Error(oldErr?.message || 'Version not found');

  const { data: newVersion, error: insertErr } = await supabaseAdmin
    .from('prompt_versions')
    .insert([
      {
        prompt_id: promptId,
        content: old.content,
        source: 'revert',
        reason: `Reverted to version ${old.version_number} (${old.id})`,
      },
    ])
    .select()
    .single();

  if (insertErr) throw new Error(insertErr.message);
  return newVersion;
}

// ============================================================================
// Classify Prompt
// ============================================================================
export async function classifyPrompt(input: string) {
  if (!input) throw new Error('Input is required');
  return libClassifyPrompt(input);
}

// ============================================================================
// Vote Prompt
// ============================================================================
export async function votePrompt(promptId: string, type: 'likes' | 'dislikes') {
  if (!promptId || !['likes', 'dislikes'].includes(type)) {
    throw new Error('Invalid data');
  }

  if (type === 'likes') {
    const { error } = await supabaseAdmin.rpc('increment_likes', { promptid: promptId });
    if (error) console.error(error);
  } else {
    const { error } = await supabaseAdmin.rpc('increment_dislikes', { promptid: promptId });
    if (error) console.error(error);
  }

  return { ok: true };
}
