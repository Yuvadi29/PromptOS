import { supabaseAdmin } from "./supabase";

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    criteria_key: string;
    criteria_threshold: number;
}

export async function evaluateBadgesForUser(userId: string): Promise<Badge[]> {
    if (!userId) return [];

    // Load user stats
    const { data: stats } = await supabaseAdmin
        .from("user_feature_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (!stats) return [];

    // Load all badges
    const { data: badges } = await supabaseAdmin
        .from("badges")
        .select("*");

    if (!badges) return [];

    // Load already-earned badges
    const { data: earnedBadges } = await supabaseAdmin
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", userId);

    const earnedSet = new Set(earnedBadges?.map(b => b?.badge_id));
    const newlyEarned: Badge[] = [];

    const badgeNotifications = [];

    for (const badge of badges) {
        if (earnedSet.has(badge.id)) continue;

        // Dynamic access to stats based on criteria_key
        // Ensure the stats object has the key; defaulting to 0 if missing
        const value = (stats as any)[badge.criteria_key] ?? 0;

        if (value >= badge.criteria_threshold) {
            console.log(`User ${userId} earned badge: ${badge.name}`);

            // Award badge
            await supabaseAdmin.from("user_badges").insert({
                user_id: userId,
                badge_id: badge.id,
            });

            // Prepare notification
            badgeNotifications.push({
                user_id: userId,
                badge_id: badge.id,
                sent_at: null // or now() if we consider it "sent" immediately to UI via return
            });

            // Send Email Notification
            // We do this asynchronously without awaiting to not block the response
            supabaseAdmin.from('users').select('email, name').eq('id', userId).single()
                .then(({ data: user }) => {
                    if (user?.email) {
                        const { sendBadgeEmail } = require('./email'); // Dynamic import to avoid cycles if any
                        sendBadgeEmail(user.email, badge.name, badge.description, user.name || 'User')
                            .catch((err: any) => console.error("Failed to send badge email:", err));
                    }
                });

            newlyEarned.push(badge);
        }
    }

    // Insert notifications for async processing if needed (or just rely on return value)
    if (badgeNotifications.length > 0) {
        await supabaseAdmin.from("badge_notifications").insert(badgeNotifications);
    }

    return newlyEarned;
}