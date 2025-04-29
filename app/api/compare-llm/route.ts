"use server";

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
});

const MODELS = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'gemma2-9b-it'];

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), { status: 400 });
    }

    const fineTunedPrompt = `You are an advanced AI assistant with a vast knowledge base, capable of providing precise, relevant, and insightful responses. Based on the following user input, generate a well-structured, clear, and accurate response.

User Input:
"${prompt}"

Instructions:

Interpret the user's request fully to understand the context, intent, and any underlying nuances.

Provide a direct, accurate answer, ensuring clarity and conciseness.

If necessary, include additional explanations or context for clarity without overwhelming the user.

Prioritize factual correctness and avoid speculation.

Ensure the tone is professional, approachable, and user-friendly.

If the query is ambiguous or requires assumptions, clarify or explain the possible interpretations and your response accordingly.

Avoid redundancy and aim for a well-organized, easy-to-read response (e.g., structured with bullet points or paragraphs if appropriate).`

    const responses = await Promise.all(
      MODELS.map(async (model) => {
        const stream = await groq.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: fineTunedPrompt,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true,
        });

        let responseContent = "";
        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.delta?.content;
          if (delta) {
            responseContent += delta;
          }
        }

        return {
          model,
          response: responseContent,
        };
      })
    );

    const result = {
      model1: responses[0].response,
      model2: responses[1].response,
      model3: responses[2].response,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in compare API: ', error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, {
      status: 500
    })

  }

}
