import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, prompt, clarity, specificity, model_fit, relevance, structure, conciseness } = await req.json();

        if (!userId || !prompt) {
            return NextResponse.json({
                message: 'Missing Data'
            }, { status: 400 });
        }

        await supabase.from("prompt_scores").insert({
            created_by: userId,
            prompt,
            clarity,
            specificity,
            model_fit,
            relevance,
            structure,
            conciseness
        });

        return NextResponse.json({
            message: 'Prompt Saved Successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
