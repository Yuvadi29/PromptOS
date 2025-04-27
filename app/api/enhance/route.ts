import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing Gemini API Key");
}

const genAI = new GoogleGenerativeAI(apiKey);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: "Invalid prompt" }), { status: 400 });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemPrompt = `
You are a world-class expert in prompt engineering and linguistic refinement. Your role is to act as a master craftsman of prompts — someone who can interpret, understand, and enhance user-provided prompts to a superior, clearer, and more effective version.

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

Formatting Instructions:
- Present ONLY the final enhanced prompt inside triple backticks (\`\`\`).
- Do NOT include any explanations before or after.
- The enhanced prompt must sound natural, precise, goal-driven, and professional.

User Input Prompt: """${prompt}"""
`;

  // Start streaming response
  const result = await model.generateContentStream([systemPrompt]);
  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        controller.enqueue(encoder.encode(chunkText));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
