import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, title, description, promptText, niche} = await req.json();

        if (!userId || !title || !description || !promptText || !niche) {
            return NextResponse.json({
                message: 'Missing Data'
            }, { status: 400 });
        }

        // Save to db
        await supabase.from("prompt_library").insert({
            created_by: userId,
            prompt_title: title,
            prompt_description: description,
            promptText: promptText,
            niche: niche,
        });

        return NextResponse.json({
            message: 'Prompt Added to Library Saved Successfully'
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

    }
}