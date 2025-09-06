import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const modelId = "openai/o3"; // Replace with your OpenRouter model
const fineTunedPrompt = `
You are an AI assistant specialized in analyzing prompts. 
For each prompt given, classify it into a Domain and Type.
Return the output in JSON: { "domain": "value", "type": "value" }.
`;

export async function GET() {
  // Fetch all prompts
  const { data: prompts, error } = await supabase.from("prompts").select("prompt_value");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const classifications = await Promise.all(
    prompts.map(async (p) => {
      const promptText = p.prompt_value;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: "system", content: fineTunedPrompt },
            { role: "user", content: promptText },
          ],
        }),
      });

      const json = await res.json();
      // OpenRouter returns message in choices[0].message.content
      let classification = { domain: "Unknown", type: "Unknown" };
      try {
        const content = json.choices[0].message.content;
        classification = JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse classification:", e);
      }
      return classification;
    })
  );

  // Aggregate domain counts
  const domainCounts: Record<string, number> = {};
  classifications.forEach((c) => {
    domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1;
  });

  const result = Object.entries(domainCounts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json(result);
}
