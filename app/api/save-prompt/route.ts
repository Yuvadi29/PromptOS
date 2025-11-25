import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, prompt, originalPrompt} = await req.json();

        if (!userId || !prompt) {
            return NextResponse.json({
                message: 'Missing Data'
            }, { status: 400 });
        }

        // Save to db
        await supabaseAdmin.from("prompts").insert({
            created_by: userId,
            prompt_value: prompt,
            original_prompt:originalPrompt
        });

        return NextResponse.json({
            message: 'Prompt Saved Successfully'
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });

    }
}