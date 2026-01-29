import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // 1. Fetch Total Counts
        const { count: totalUsers, error: usersError } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true });

        const { count: totalPrompts, error: promptsError } = await supabase
            .from("prompts")
            .select("*", { count: "exact", head: true });

        const { count: totalSessions, error: sessionsError } = await supabase
            .from("prompt_sessions")
            .select("*", { count: "exact", head: true });

        const { count: totalLibrary, error: libraryError } = await supabase
            .from("prompt_library")
            .select("*", { count: "exact", head: true });

        if (usersError || promptsError || sessionsError || libraryError) {
            console.error("Error fetching counts:", { usersError, promptsError, sessionsError, libraryError });
            return NextResponse.json({ error: "Failed to fetch aggregated stats" }, { status: 500 });
        }

        // 2. Fetch Recent Growth (Last 30 Days) & Daily Activity
        // We will fetch created_at dates for the last 30 days to build the chart data on the server side
        // or send the raw dates to the frontend. For performance with large datasets, aggregation on DB is better,
        // but standard Supabase client doesn't support complex GROUP BY easily without RPC. 
        // Given the likely scale, we'll fetch ID/created_at for the last 30 days and aggregate in JS.

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateLimit = thirtyDaysAgo.toISOString();

        const { data: recentUsers, error: recentUsersError } = await supabase
            .from("users")
            .select("created_at")
            .gte("created_at", dateLimit)
            .order("created_at", { ascending: true });

        const { data: recentPrompts, error: recentPromptsError } = await supabase
            .from("prompts")
            .select("created_at")
            .gte("created_at", dateLimit)
            .order("created_at", { ascending: true });

        if (recentUsersError || recentPromptsError) {
            console.error("Error fetching recent data:", { recentUsersError, recentPromptsError });
            return NextResponse.json({ error: "Failed to fetch recent activity" }, { status: 500 });
        }

        // Process daily activity
        const dailyActivity = processDailyActivity(recentUsers || [], recentPrompts || []);

        return NextResponse.json({
            counts: {
                users: totalUsers || 0,
                prompts: totalPrompts || 0,
                sessions: totalSessions || 0,
                library: totalLibrary || 0,
            },
            recentGrowth: {
                users: recentUsers?.length || 0,
                prompts: recentPrompts?.length || 0,
            },
            dailyActivity,
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

function processDailyActivity(users: any[], prompts: any[]) {
    const activityMap = new Map<string, { date: string; users: number; prompts: number }>();

    // Initialize last 30 days
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        activityMap.set(dateStr, { date: dateStr, users: 0, prompts: 0 });
    }

    users.forEach(u => {
        if (!u.created_at) return;
        const dateStr = new Date(u.created_at).toISOString().split('T')[0];
        if (activityMap.has(dateStr)) {
            activityMap.get(dateStr)!.users += 1;
        }
    });

    prompts.forEach(p => {
        if (!p.created_at) return;
        const dateStr = new Date(p.created_at).toISOString().split('T')[0];
        if (activityMap.has(dateStr)) {
            activityMap.get(dateStr)!.prompts += 1;
        }
    });

    return Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}
