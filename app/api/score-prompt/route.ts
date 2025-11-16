"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing Gemini API Key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an expert Prompt Quality Evaluator trained to assess the effectiveness of user-generated prompts for Large Language Models (LLMs) like Gemini or GPT. Your task is to analyze a given prompt and return a strict JSON object with integer scores (1 to 10) across the following six categories:

1. Clarity: Is the prompt’s intent clear and easy to understand?
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
📏 Ensure scores are whole numbers between 1 and 10.

`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser Prompt:\n${prompt}`);


    const text = result.response.text();

    const match = text.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error("No valid JSON in Gemini response");

    const raw = JSON.parse(match[0]);

    const criteriaScores = {
      clarity: raw?.clarity,
      specificity: raw?.specificity,
      model_fit: raw?.model_fit,
      relevance: raw?.relevance,
      structure: raw?.structure,
      conciseness: raw?.conciseness,
    };

    const total = Object.values(criteriaScores).reduce((sum, score) => sum + score, 0);
    const overallScore = Math.round((total / 60) * 100); // convert to percent

    return NextResponse.json({
      overallScore,
      criteriaScores,
      feedback: raw.tip || "Great work! No improvement needed.",
    });

  } catch (error) {
    console.error("Scoring Error:", error);
    return NextResponse.json(
      { error: "Invalid Response format from Gemini." },
      { status: 500 }
    );
  }
}
