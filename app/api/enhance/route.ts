import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { classifyPrompt } from '@/lib/prompt-classifier';
import { getTemplate } from '@/lib/prompt-templates';
import { buildFormats } from '@/lib/prompt-formatters';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing Gemini API Key');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  let prompt = '';
  let answers: any[] = [];

  try {
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const body = await req.json();

      prompt = body.prompt || body.input || '';
      answers = body.answers || [];
    } else {
      prompt = await req.text();
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  // Auth & Stats Logging
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const { supabaseAdmin } = await import('@/lib/supabase');
      const { data: u } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();
      if (u) {
        const { logActivityAndCalculateStreak } = await import('@/lib/streaks');
        // Fire and forget so we don't delay the stream
        logActivityAndCalculateStreak(u.id, 'prompt_enhanced', { prompt }).catch(console.error);
      }
    }
  } catch (e) {
    console.error('Stats error', e);
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Build context section from Q&A answers if provided
  let contextSection = '';
  if (answers && Array.isArray(answers) && answers.length > 0) {
    contextSection = `

IMPORTANT ADDITIONAL CONTEXT FROM USER:
The user was asked clarifying questions and provided the following answers. Use these answers heavily to tailor and enhance the prompt:

${answers.map((a: { question: string; answer: string }, i: number) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n')}

Use the above answers to deeply personalize the enhanced prompt — incorporate the target audience, tone, specificity, constraints, and output format the user specified.
`;
  }

  const classification = await classifyPrompt(prompt);
  const template = getTemplate(classification.type);

  const systemPrompt = `
You are a world-class expert in prompt engineering and linguistic refinement. Your role is to act as a master craftsman of prompts — someone who can interpret, understand, and enhance user-provided prompts to a superior, clearer, and more effective version. Your task is to enhance the user prompt based on its intent and structure.

Detected Prompt Type: ${classification.type}

Follow these principles and steps meticulously:

1. Analyze:
  - Carefully read the user's input prompt.
  - Identify the domain (e.g., creative writing, coding, marketing, study, business, etc.).
  - Understand any implicit or explicit goals, tasks, or desired outputs embedded in the prompt.
  - If necessary, infer missing details logically based on common use cases and best practices.

2. Understand:
  - Determine the core *intention* behind the user's prompt.
  - Ask yourself: "What exactly is the user trying to achieve with this?"
  - Pay attention to tone, style, target audience, complexity, and context.

3. Enhance:
  - Rewrite the user's prompt into a highly detailed, actionable, clear, and optimized version.
  - Structure it properly with clarifications, better instructions, and relevant detail additions.
  - Maintain the original spirit but elevate the quality dramatically.
  - Ensure the enhanced prompt is ready for accurate and effective output.

IMPORTANT STRUCTURE TO FOLLOW:
${template}

Formatting Instructions:
- Present ONLY the final enhanced prompt inside triple backticks (\`\`\`).
- Do NOT include any explanations before or after.
- The enhanced prompt must sound natural, precise, goal-driven, and professional.
${contextSection}
User Input Prompt: 
"""${prompt}"""
`;

  try {
    const result = await model.generateContent(systemPrompt + prompt);
    const text = result.response.text().replace(/``` /g, '').trim();

    // Build formats
    const formats = buildFormats(text, classification.type);

    return NextResponse.json({
      type: classification.type,
      formats,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'API Error', message: error.message }, { status: 400 });
  }
}
