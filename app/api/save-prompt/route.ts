import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, prompt } = await req.json();

        if (!userId || !prompt) {
            return NextResponse.json({
                message: 'Missing Data'
            }, { status: 400 });
        }

        // Save to db
        await supabase.from("prompts").insert({
            created_by: userId,
            prompt_value: prompt
        });

        return NextResponse.json({
            message: 'Prompt Saved Successfully'
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

    }
}