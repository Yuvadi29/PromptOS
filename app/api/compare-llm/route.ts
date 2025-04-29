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

  const responses = await Promise.all(
    MODELS.map(async (model) => {
        const chatCompletion = await groq.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content: "You are a helful assistant. Answer concisely and clearly.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return {
            model,
            response: chatCompletion.choices[0].message.content,
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
