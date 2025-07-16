"use server";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, models } = await req.json();

    if (!prompt || typeof prompt !== "string" || !Array.isArray(models) || models.length !== 3) {
      return new Response(JSON.stringify({ error: "Invalid prompt or model selection" }), {
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

        for (let i = 0; i < models.length; i++) {
          const modelId = models[i];

          controller.enqueue(encoder.encode(`\n\n--- Model ${i + 1} (${modelId}) ---\n\n`));

          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://promptos.in",
              "X-Title": "PromptOS",
            },
            body: JSON.stringify({
              model: modelId,
              stream: true,
              messages: [
                { role: "system", content: fineTunedPrompt },
                { role: "user", content: prompt },
              ],
            }),
          });

          if (!response.body) {
            controller.enqueue(encoder.encode(`[Error getting response from ${modelId}]\n\n`));
            continue;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          let done = false;

          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const jsonStr = line.slice(6).trim();

                  if (jsonStr === "[DONE]") continue;

                  try {
                    const parsed = JSON.parse(jsonStr);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(encoder.encode(content));
                    }
                  } catch (err) {
                    console.error("Invalid JSON chunk from model", err);
                  }
                }
              }
            }
          }

        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
