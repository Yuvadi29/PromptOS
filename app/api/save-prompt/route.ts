import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { updateUserStreak } from "@/lib/streaks";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const { prompt, originalPrompt } = await req.json();

        // Securely fetch session
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the user string ID safely on the backend
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();

        if (userError || !userData?.id) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userId = String(userData.id);

        if (!userId || !prompt) {
            return NextResponse.json({
                message: 'Missing Data'
            }, { status: 400 });
        }

        // Save to db
        const { error } = await supabaseAdmin.from("prompts").insert({
            created_by: userId,
            prompt_value: prompt,
            original_prompt: originalPrompt
        });

        if (error) {
            console.error("Failed to save prompt:", error);
            return NextResponse.json({
                message: 'Failed to save prompt',
                error: error.message
            }, { status: 500 });
        }

        // Update streak
        await updateUserStreak(userId);

        return NextResponse.json({
            message: 'Prompt Saved Successfully'
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
