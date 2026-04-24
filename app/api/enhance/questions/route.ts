import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        status: 400,
      });
    }

    // Move API key check inside the handler to prevent serverless cold-start crashes
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing Gemini API Key in environment variables.");
      return new Response(JSON.stringify({ error: "API Key Configuration Error" }), {
        status: 500,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
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

    const result = await model.generateContent([systemPrompt]);
    const text = result.response.text();

    // Parse the JSON array from the response safely
    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini output as JSON:", text);
      throw new Error("Invalid JSON from LLM");
    }

    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error("Invalid questions format returned by LLM");
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating questions:", error);
    
    // FALLBACK: If Gemini API is rate-limited, down, or hallucinates bad JSON, 
    // we return generic clarifying questions so the UI does not crash in production.
    const fallbackQuestions = [
      "Who is the specific target audience or AI model for this prompt?",
      "What tone and style should the output have (e.g., professional, casual, analytical)?",
      "Are there any specific constraints, word limits, or things to avoid?",
      "What format should the final output be in (e.g., bullet points, essay, code)?",
      "What is the ultimate goal or key takeaway you want to achieve with this output?"
    ];

    return new Response(JSON.stringify({ questions: fallbackQuestions }), {
      headers: { "Content-Type": "application/json" },
      status: 200 // Return 200 with fallback so the UI can proceed normally
    });
  }
}
