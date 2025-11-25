import { embedText } from "@/lib/embedding";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
    _req: Request,
    { params }: { params: { id: string } }
) {
    // Fetch Prompt
    const { data: prompt, error } = await supabaseAdmin
        .from("prompts")
        .select("id,prompt_value")
        .eq("id", params.id)
        .single();

    if (error || !prompt) {
        return NextResponse.json({ error: "Prompt not found" }, { status: 404 });

    }

    // Embed
    const embedding = await embedText(prompt?.prompt_value);

    // Upsert Embedding
    const { error: upErr } = await supabaseAdmin
        .from("prompts")
        .update({ embedding })
        .eq("id", prompt?.id);

    if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}