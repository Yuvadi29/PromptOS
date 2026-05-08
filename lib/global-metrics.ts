'use server';

import { supabaseAdmin } from './supabase';

export async function getGlobalMetrics() {
  try {
    // 1. Total Prompts Enhanced (from prompts table)
    const { count: promptCount } = await supabaseAdmin
      .from('prompts')
      .select('*', { count: 'exact' });

    // 2. Average Quality Score (from prompt_scores table)
    const { data: scores } = await supabaseAdmin
      .from('prompt_scores')
      .select('clarity, specificity, model_fit, relevance, structure, conciseness');

    let avgScore = 0;
    if (scores && scores.length > 0) {
      const total = scores.reduce((acc, curr) => {
        const sum =
          curr.clarity +
          curr.specificity +
          curr.model_fit +
          curr.relevance +
          curr.structure +
          curr.conciseness;
        return acc + sum / 6;
      }, 0);
      avgScore = total / scores.length;
    }

    // 3. Active Users
    const { count: userCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 4. Library size
    const { count: libraryCount } = await supabaseAdmin
      .from('prompt_library')
      .select('*', { count: 'exact', head: true });

    return {
      totalPrompts: promptCount || 0,
      avgQuality: Math.round(avgScore * 10) / 10 || 0,
      activeUsers: userCount || 0,
      librarySize: libraryCount || 0,
    };
  } catch (err) {
    console.error('Error fetching global metrics:', err);
    return {
      totalPrompts: 0,
      avgQuality: 0,
      activeUsers: 0,
      librarySize: 0,
    };
  }
}
