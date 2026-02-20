import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, created_at')
            .eq('email', session.user.email)
            .single();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Run prompts + activity queries in parallel for speed
        const [promptsResult, activitiesResult] = await Promise.all([
            supabaseAdmin
                .from('prompts')
                .select('id')
                .eq('created_by', user.id),
            supabaseAdmin
                .from('user_activity_log')
                .select('action')
                .eq('user_id', user.id)
        ]);

        const prompts = promptsResult.data || [];
        const activities = activitiesResult.data || [];

        const totalPrompts = prompts.length;

        // Build radar breakdown
        const breakdown = [
            { subject: 'Prompt Library', A: 0, fullMark: 100 },
            { subject: 'Enhancement', A: 0, fullMark: 100 },
            { subject: 'LLM Comparison', A: 0, fullMark: 100 },
            { subject: 'Scoring', A: 0, fullMark: 100 }
        ];

        activities.forEach(act => {
            if (act.action === 'prompt_library_added') breakdown[0].A += 10;
            else if (act.action === 'prompt_enhanced') breakdown[1].A += 10;
            else if (act.action === 'llm_compared') breakdown[2].A += 10;
            else if (act.action === 'prompt_scored') breakdown[3].A += 10;
        });

        const maxVal = Math.max(...breakdown.map(l => l.A));
        if (maxVal > 100) {
            breakdown.forEach(l => l.A = Math.round((l.A / maxVal) * 100));
        }

        return NextResponse.json({
            totalPrompts,
            activityBreakdown: breakdown,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
