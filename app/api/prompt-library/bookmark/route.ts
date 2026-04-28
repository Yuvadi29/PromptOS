import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/prompt-library/bookmark
 *
 * Without query params  → returns an array of bookmarked prompt IDs for the
 *                          current user  (used by Prompt Library to highlight icons)
 * With ?populated=true  → returns full prompt details joined via prompt_library
 *                          (used by the Bookmarked Prompts page)
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: user } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const populated = req.nextUrl.searchParams.get("populated") === "true";

        if (populated) {
            // Return full prompt details for the bookmarked-prompts page
            const { data, error } = await supabaseAdmin
                .from("prompt_bookmarks")
                .select(`
                    id,
                    created_at,
                    prompt_library (
                        id,
                        prompt_title,
                        prompt_description,
                        "promptText",
                        niche,
                        likes,
                        dislikes,
                        created_by,
                        users (
                            name,
                            username,
                            image
                        )
                    )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Supabase error:", error.message);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json(data, { status: 200 });
        }

        // Default: return just the prompt_id array
        const { data, error } = await supabaseAdmin
            .from("prompt_bookmarks")
            .select("prompt_id")
            .eq("user_id", user.id);

        if (error) {
            console.error("Supabase error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const ids = (data || []).map((row: any) => row.prompt_id);
        return NextResponse.json(ids, { status: 200 });
    } catch (error: any) {
        console.error("[BOOKMARK GET ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/prompt-library/bookmark
 *
 * Toggle a bookmark for the given prompt.
 * Body: { promptId: number }
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { promptId } = await req.json();
        if (!promptId) {
            return NextResponse.json({ error: "Missing promptId" }, { status: 400 });
        }

        const { data: user } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if bookmark already exists
        const { data: existing } = await supabaseAdmin
            .from("prompt_bookmarks")
            .select("id")
            .eq("user_id", user.id)
            .eq("prompt_id", promptId)
            .maybeSingle();

        if (existing) {
            // Remove bookmark
            const { error } = await supabaseAdmin
                .from("prompt_bookmarks")
                .delete()
                .eq("id", existing.id);

            if (error) {
                console.error("Supabase delete error:", error.message);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ bookmarked: false, message: "Bookmark removed" }, { status: 200 });
        }

        // Add bookmark
        const { error } = await supabaseAdmin
            .from("prompt_bookmarks")
            .insert({ user_id: user.id, prompt_id: promptId });

        if (error) {
            console.error("Supabase insert error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ bookmarked: true, message: "Bookmark added" }, { status: 200 });
    } catch (error: any) {
        console.error("[BOOKMARK POST ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
