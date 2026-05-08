import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPlatformAnalysis } from '@/lib/platform-analysis';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
        status: 400,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key Configuration Error' }), {
        status: 500,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are a world-class prompt engineer. Your task is to take a raw, simple user prompt and transform it into a highly effective, structured, and clear prompt that will get the best possible results from an LLM.

Rules:
1. Preserve the original intent but add structure, context, and clear instructions.
2. Use professional formatting (Markdown).
3. Be concise but comprehensive.
4. Output ONLY the enhanced prompt. Do not include any meta-talk or explanations.

Original Prompt: """${prompt}"""

Enhanced Prompt:`;

    const result = await model.generateContent([systemPrompt]);
    const enhancedPrompt = result.response.text().trim();

    // Perform real-time platform analysis
    const platformAnalysis = await getPlatformAnalysis(prompt, enhancedPrompt);

    // Mock scores for the demo
    const clarityScore = 8.5 + Math.random() * 1.4;
    const tokensSaved = Math.floor(Math.random() * 45) + 20; // 20-65%
    const costOptimization = (Math.random() * 0.4 + 0.1).toFixed(2); // $0.10 - $0.50

    return new Response(
      JSON.stringify({
        enhancedPrompt,
        platformAnalysis,
        metrics: {
          clarityScore: clarityScore.toFixed(1),
          tokensSaved: `${tokensSaved}%`,
          costOptimization: `$${costOptimization}`,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in public enhancement demo:', error);
    return new Response(JSON.stringify({ error: 'Failed to enhance prompt' }), {
      status: 500,
    });
  }
}
