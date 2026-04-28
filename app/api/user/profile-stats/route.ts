import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { differenceInDays, parseISO, format, subDays } from "date-fns";

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

        // ── Run all queries in parallel ──
        const sevenDaysAgo = subDays(new Date(), 7).toISOString();

        const [
            promptsResult,
            activitiesResult,
            streakResult,
            libraryPromptsResult,
            weeklyActivitiesResult,
            topPromptResult,
            recentActivitiesResult,
        ] = await Promise.all([
            // Total prompts created
            supabaseAdmin
                .from('prompts')
                .select('id')
                .eq('created_by', user.id),

            // All activity log entries (for radar)
            supabaseAdmin
                .from('user_activity_log')
                .select('action, metadata, created_at')
                .eq('user_id', user.id),

            // Current streak
            supabaseAdmin
                .from('user_streaks')
                .select('current_streak, last_active_date')
                .eq('user_id', user.id)
                .maybeSingle(),

            // User's prompts in the library (for niche + top prompt)
            supabaseAdmin
                .from('prompt_library')
                .select('id, prompt_title, niche, likes, dislikes')
                .eq('created_by', user.id),

            // Last 7 days of activity (for sparkline)
            supabaseAdmin
                .from('user_activity_log')
                .select('created_at')
                .eq('user_id', user.id)
                .gte('created_at', sevenDaysAgo)
                .order('created_at', { ascending: true }),

            // Top prompt (most liked from library)
            supabaseAdmin
                .from('prompt_library')
                .select('id, prompt_title, prompt_description, niche, likes, dislikes')
                .eq('created_by', user.id)
                .order('likes', { ascending: false })
                .limit(1)
                .maybeSingle(),

            // Recent 5 activities for feed
            supabaseAdmin
                .from('user_activity_log')
                .select('action, metadata, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5),
        ]);

        const prompts = promptsResult.data || [];
        const activities = activitiesResult.data || [];
        const totalPrompts = prompts.length;

        // ── Radar breakdown ──
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

        // ── Current Streak ──
        let currentStreak = 0;
        if (streakResult.data) {
            const streakData = streakResult.data;
            if (streakData.last_active_date) {
                const todayDate = parseISO(format(new Date(), 'yyyy-MM-dd'));
                const lastActiveDate = parseISO(streakData.last_active_date);
                const daysDiff = differenceInDays(todayDate, lastActiveDate);
                currentStreak = daysDiff <= 1 ? streakData.current_streak : 0;
            }
        }

        // ── Most Used Niche ──
        const nicheCounts: Record<string, number> = {};
        (libraryPromptsResult.data || []).forEach((p: any) => {
            if (p.niche) {
                nicheCounts[p.niche] = (nicheCounts[p.niche] || 0) + 1;
            }
        });
        const mostUsedNiche = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        // ── Weekly Activity Sparkline (last 7 days) ──
        const weeklySparkline: number[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const day = format(subDays(today, i), 'yyyy-MM-dd');
            const count = (weeklyActivitiesResult.data || []).filter((a: any) => {
                const actDay = format(new Date(a.created_at), 'yyyy-MM-dd');
                return actDay === day;
            }).length;
            weeklySparkline.push(count);
        }

        // ── Top Prompt ──
        const topPrompt = topPromptResult.data ? {
            id: topPromptResult.data.id,
            title: topPromptResult.data.prompt_title,
            description: topPromptResult.data.prompt_description,
            niche: topPromptResult.data.niche,
            likes: topPromptResult.data.likes || 0,
            dislikes: topPromptResult.data.dislikes || 0,
        } : null;

        // ── Recent Activity Feed ──
        const ACTION_LABELS: Record<string, string> = {
            'prompt_enhanced': 'Enhanced a prompt',
            'llm_compared': 'Compared LLMs',
            'prompt_scored': 'Scored a prompt',
            'prompt_library_added': 'Added to library',
        };

        const recentActivity = (recentActivitiesResult.data || []).map((a: any) => ({
            action: a.action,
            label: ACTION_LABELS[a.action] || a.action,
            metadata: a.metadata,
            createdAt: a.created_at,
        }));

        // ── Member Since ──
        const memberSince = user.created_at || null;

        // ── Favorite Models (from llm_compared metadata) ──
        // The current compare-llm route only stores { prompt } as metadata, not models.
        // We derive what we can from the data. For now, count comparison frequency.
        const totalComparisons = activities.filter(a => a.action === 'llm_compared').length;

        return NextResponse.json({
            totalPrompts,
            activityBreakdown: breakdown,
            currentStreak,
            mostUsedNiche,
            weeklySparkline,
            topPrompt,
            recentActivity,
            memberSince,
            totalComparisons,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
