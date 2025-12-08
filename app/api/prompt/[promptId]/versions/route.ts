import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// List all versions with stats
export async function GET(
    req: Request,
    { params }: {
        params: {
            promptId: string
        }
    }
) {
    const { promptId } = await params;

    const { data, error } = await supabaseAdmin
        .from("prompt_version_stats")
        .select("*")
        .eq("prompt_id", promptId)
        .order("version_number", {
            ascending: false
        });

    if (error) {
        console.error(error);
        return NextResponse.json({
            error: error.message
        }, {
            status: 500
        });
    }

    return NextResponse.json(data, {
        status: 200
    });
}

// Create new version
export async function POST(
    req: Request,
    { params }: {
        params: {
            promptId: string
        }
    }
) {
    const { promptId } = params;
    const body = await req.json();
    const { content, source = "user", reason = null, meta = {} } = body;

    if (!content) {
        return NextResponse.json({
            error: "Content is Required"
        }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("prompt_versions")
        .insert([
            {
                prompt_id: promptId,
                content,
                source,
                reason,
                meta
            }
        ])
        .select()
        .single();

    if (error) {
        console.error(error);
        return NextResponse.json({
            error: error.message
        }, {
            status: 500
        });
    }

    return NextResponse.json(data, {
        status: 201
    });
}
