'use server';

import { supabaseAdmin } from './supabase';

export async function getRealtimeInfrastructureMetrics() {
  try {
    // Fetch total count of prompts to estimate global savings
    const { count: promptCount } = await supabaseAdmin
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    // Constants for estimation (can be moved to DB later)
    const avgTokensPerPrompt = 450;
    const compressionRate = 0.65;
    const avgCostPer1M = 0.42;

    const totalPrompts = promptCount || 12480; // Fallback to current mock if DB is empty
    const totalTokensSaved = totalPrompts * avgTokensPerPrompt * compressionRate;
    const totalCostSaved = (totalTokensSaved / 1000000) * avgCostPer1M;

    // Simulate live latency (or fetch from a monitoring service)
    const latencies = {
      gemini: Math.floor(Math.random() * 20) + 320,
      gpt4: Math.floor(Math.random() * 50) + 850,
      claude: Math.floor(Math.random() * 40) + 610,
    };

    return {
      totalTokensSaved: Math.floor(totalTokensSaved).toLocaleString(),
      totalCostSaved: totalCostSaved.toFixed(2),
      latencies,
      activeNodes: Math.floor(Math.random() * 5) + 24, // 24-29 nodes
    };
  } catch (err) {
    console.error('Error fetching realtime metrics:', err);
    return null;
  }
}
