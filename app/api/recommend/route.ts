import { NextResponse } from "next/server";
import { embedText } from "@/lib/embedding";
import { supabaseAdmin } from "@/lib/supabase";

type Payload = {
    queryText?: string;
    queryEmbedding?: number[];
    excludeId?: string;
    limit?: number;
    createdBy: string; //Filter to a user
    category?: string; // if we store categories
    minSimilarity?: number; // 0..1
}

export async function POST(req: Request) {
    const {
        queryText,
        queryEmbedding,
        excludeId,
        limit = 6,
        createdBy,
        category,
        minSimilarity = 0.2,
    } = (await req.json()) as Payload;

    const embedding = queryEmbedding ?? (queryText ? await embedText(queryText) : null);
    if (!embedding) {
        return NextResponse.json({ error: "queryText or queryEmbedding required" }, { status: 400 });
    }

    // Supabase RPC like query using SQL filter
    let base = supabaseAdmin
        .rpc("match_prompts", {
            query_embedding: embedding,
            match_count: limit + 3, //Fetch few extra then post-filter
        });

    // You can't chain where with RPC easily, so use a SQL function
    const { data, error } = await base;
    if (error) return NextResponse.json({ error: error?.message }, { status: 500 });

    // post-filter (excludeId / createdBy / category / minSimilarity if your function doesn’t handle it)
    const filtered = data
        .filter((r: any) => (excludeId ? r?.id !== excludeId : true))
        .filter((r: any) => (createdBy ? r.created_by === createdBy : true))
        .filter((r: any) => (category ? r.category === category : true))
        .filter((r: any) => (r.similarity ?? 0) >= minSimilarity)
        .slice(0, limit);

    return NextResponse.json({ results: filtered });

}