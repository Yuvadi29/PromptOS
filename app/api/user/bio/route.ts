import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: user } = await supabaseAdmin
            .from("users")
            .select("bio")
            .eq("email", session.user.email)
            .single();

        return NextResponse.json({ bio: user?.bio || "" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bio } = await req.json();
        if (typeof bio !== "string") {
            return NextResponse.json({ error: "Invalid bio" }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from("users")
            .update({ bio: bio.slice(0, 2000) }) // cap at 2000 chars
            .eq("email", session.user.email);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Bio updated" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
