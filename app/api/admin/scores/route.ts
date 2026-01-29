import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    // Fetch scores (last 100 to avoid huge payload)
    const { data: scores, error: scoresError } = await supabase
        .from("prompt_scores")
        .select("id, prompt, clarity, specificity, model_fit, relevance, structure, conciseness, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

    if (scoresError) return NextResponse.json({ error: scoresError.message }, { status: 500 });

    // Calculate averages
    let averages = {
        clarity: 0,
        specificity: 0,
        model_fit: 0,
        relevance: 0,
        structure: 0,
        conciseness: 0
    };

    if (scores && scores.length > 0) {
        scores.forEach(s => {
            averages.clarity += s.clarity;
            averages.specificity += s.specificity;
            averages.model_fit += s.model_fit;
            averages.relevance += s.relevance;
            averages.structure += s.structure;
            averages.conciseness += s.conciseness;
        });

        const count = scores.length;
        averages.clarity /= count;
        averages.specificity /= count;
        averages.model_fit /= count;
        averages.relevance /= count;
        averages.structure /= count;
        averages.conciseness /= count;
    }

    return NextResponse.json({
        recentScores: scores,
        averages
    });
}
