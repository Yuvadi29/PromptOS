"use server";

import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

const MODELS = [
  { name: "llama-3.3-70b-versatile", label: "Model 1 (LLaMA 3.3 70B)" },
  { name: "llama3-70b-8192", label: "Model 2 (LLaMA 70B 8192)" },
  { name: "gemma2-9b-it", label: "Model 3 (Gemma 9B IT)" },
];

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        status: 400,
      });
    }

    const fineTunedPrompt = `You are an advanced AI assistant with a vast knowledge base, capable of providing precise, relevant, and insightful responses. Based on the following user input, generate a well-structured, clear, and accurate response.

User Input:
"${prompt}"

Instructions:
- Understand the context and intent.
- Provide a direct, clear, and correct answer.
- Add concise context where useful.
- Remain professional and easy to follow.
`;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        for (const { name, label } of MODELS) {
          // Write model label
          controller.enqueue(encoder.encode(`\n\n--- ${label} ---\n\n`));

          const responseStream = await groq.chat.completions.create({
            model: name,
            messages: [
              { role: "system", content: fineTunedPrompt },
              { role: "user", content: prompt },
            ],
            stream: true,
          });

          for await (const chunk of responseStream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error in multi-model stream API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
