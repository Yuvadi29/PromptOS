import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing Gemini API Key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return new Response(JSON.stringify({ error: "Invalid prompt" }), {
      status: 400,
    });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

User's prompt: """${prompt}"""`;

  try {
    const result = await model.generateContent([systemPrompt]);
    const text = result.response.text();

    // Parse the JSON array from the response
    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions = JSON.parse(cleanText);

    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error("Invalid questions format");
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate questions" }),
      { status: 500 }
    );
  }
}
