import { embedText } from "@/lib/embedding";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
    _req: Request,
    { params }: { params: { id: string } }
) {
    // Fetch Prompt
    const { data: prompt, error } = await supabase
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
    const { error: upErr } = await supabase
        .from("prompts")
        .update({ embedding })
        .eq("id", prompt?.id);

    if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}