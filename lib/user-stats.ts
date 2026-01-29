'use server';

import { supabaseAdmin } from './supabase';
import { evaluateBadgesForUser } from './evaluateBadges';
import { revalidatePath } from 'next/cache';

/**
 * Increments a specific user statistic and checks for new badges.
 * @param userId The User ID
 * @param statKey The column name in user_feature_stats (e.g., 'prompts_created')
 * @param amount Amount to increment (default 1)
 * @returns Array of newly earned badges
 */
export async function incrementUserStat(userId: string, statKey: string, amount: number = 1) {
    if (!userId) return [];

    console.log(`[Badges] Incrementing ${statKey} by ${amount} for user ${userId}`);

    try {
        // 1. Get current stats or initialize
        const { data: current, error } = await supabaseAdmin
            .from('user_feature_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Relation null" (row not found)
            console.error('[Badges] Error fetching stats:', error);
            return [];
        }

        if (!current) {
            // Create row
            await supabaseAdmin.from('user_feature_stats').insert({
                user_id: userId,
                [statKey]: amount,
                last_active: new Date().toISOString()
            });
        } else {
            // Update row
            const currentValue = (current as any)[statKey] || 0;
            await supabaseAdmin.from('user_feature_stats').update({
                [statKey]: currentValue + amount,
                last_active: new Date().toISOString()
            }).eq('user_id', userId);
        }

        // 2. Log activity
        await supabaseAdmin.from('user_activity_log').insert({
            user_id: userId,
            action: `increment_${statKey}`,
            metadata: { count: amount }
        });

        // 3. Evaluate Badges
        const newBadges = await evaluateBadgesForUser(userId);

        if (newBadges.length > 0) {
            // Revalidate paths where badges might show
            revalidatePath('/profile');
            revalidatePath('/');
        }

        return newBadges;

    } catch (err) {
        console.error('[Badges] Unexpected error:', err);
        return [];
    }
}
