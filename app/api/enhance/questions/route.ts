import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  let promptText = '';
  try {
    const body = await req.json();
    promptText = body.prompt || '';

    if (!promptText || typeof promptText !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
        status: 400,
      });
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('Missing OpenRouter API Key in environment variables.');
      return new Response(JSON.stringify({ error: 'API Key Configuration Error' }), {
        status: 500,
      });
    }

    const openrouter = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });

    const systemPrompt = `You are an expert prompt engineering assistant. A user wants to create/enhance a prompt and has provided an initial description of what they want.

Your job is to generate exactly 5 short, focused clarifying questions that will help you understand their needs better so you can craft the perfect prompt for them.

The questions should cover these areas (adapt based on the user's input):
1. **Target audience / Who will use this prompt** — Who is the intended user or what AI model will receive this prompt?
2. **Tone & style** — What tone, voice, or writing style should the output have?
3. **Specificity & scope** — How detailed or broad should the output be? Any specific areas to focus on?
4. **Constraints & requirements** — Any word limits, format requirements, things to avoid, or must-include elements?
5. **Desired output format** — What format should the final output be in? (e.g., bullet points, essay, code, step-by-step, etc.)

IMPORTANT RULES:
- Return ONLY a valid JSON array of exactly 5 strings (the questions).
- Each question should be concise (1-2 sentences max).
- Make questions specific to the user's prompt topic, not generic.
- Do NOT include any explanation or text outside the JSON array.
- Do NOT wrap in markdown code blocks.

User's prompt: """${promptText}"""`;

    // We use a cheap, fast paid model (google/gemini-2.5-flash-lite) to avoid 429 rate limit errors from the free tier.
    const completion = await openrouter.chat.completions.create({
      model: 'google/gemini-2.5-flash-lite',
      messages: [{ role: 'user', content: systemPrompt }],
    });

    const text = completion.choices[0]?.message?.content ?? '';

    // Parse the JSON array from the response safely
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleanText);
    } catch {
      console.error('Failed to parse OpenRouter output as JSON:', text);
      throw new Error('Invalid JSON from LLM');
    }

    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error('Invalid questions format returned by LLM');
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating questions:', error);

    const promptSnippet = promptText ? `for "${promptText.substring(0, 30)}..."` : '';

    // FALLBACK: If OpenRouter API is rate-limited (429), down, or hallucinates bad JSON,
    // we return generic clarifying questions so the UI does not crash in production.
    const fallbackQuestions = [
      `Who is the specific target audience or AI model ${promptSnippet}?`,
      'What tone and style should the output have (e.g., professional, casual, analytical)?',
      'Are there any specific constraints, word limits, or things to avoid?',
      'What format should the final output be in (e.g., bullet points, essay, code)?',
      'What is the ultimate goal or key takeaway you want to achieve with this output?',
    ];

    return new Response(JSON.stringify({ questions: fallbackQuestions }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200, // Return 200 with fallback so the UI can proceed normally
    });
  }
}
