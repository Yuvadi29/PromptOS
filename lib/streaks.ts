'use server';

import { supabaseAdmin } from './supabase';
import { revalidatePath } from 'next/cache';
import { differenceInDays, parseISO, startOfDay, format } from 'date-fns';

/**
 * Updates the user's daily streak.
 * This is internally used by `logActivityAndCalculateStreak`
 * but can be called standalone.
 */
export async function updateUserStreak(userId: string) {
    if (!userId) return null;

    console.log(`[Streaks] Updating streak for user ${userId}`);

    try {
        // Generate today in local YYYY-MM-DD to avoid Node runtime UTC drift
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const todayDate = parseISO(todayStr);

        // 1. Get current streak
        const { data: current, error } = await supabaseAdmin
            .from('user_streaks')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('[Streaks] Error fetching streak:', error);
            return null;
        }

        let newStreakCount = 1;

        if (current) {
            if (current.last_active_date) {
                const lastActiveDate = parseISO(current.last_active_date);
                // Compare exact midnights of parsed local YYYY-MM-DD strings
                const daysDiff = differenceInDays(todayDate, lastActiveDate);

                if (daysDiff === 0) {
                    // Already updated today
                    return current.current_streak;
                } else if (daysDiff === 1) {
                    // Active yesterday, increment streak
                    newStreakCount = (current.current_streak || 0) + 1;
                } else {
                    // Streak broken, reset to 1
                    newStreakCount = 1;
                }
            }

            // Update
            await supabaseAdmin.from('user_streaks').update({
                current_streak: newStreakCount,
                last_active_date: todayStr
            }).eq('user_id', userId);

        } else {
            // Create
            await supabaseAdmin.from('user_streaks').insert({
                user_id: userId,
                current_streak: 1,
                last_active_date: todayStr
            });
        }

        // Ensure UI updates
        revalidatePath('/dashboard');
        return newStreakCount;

    } catch (err) {
        console.error('[Streaks] Unexpected error:', err);
        return null;
    }
}

/**
 * Gets the current streak for a user without updating it.
 */
export async function getUserStreak(userId: string) {
    if (!userId) return 0;

    try {
        const { data, error } = await supabaseAdmin
            .from('user_streaks')
            .select('current_streak, last_active_date')
            .eq('user_id', userId)
            .single();

        if (error || !data) return 0;

        // Optional: Check if streak is broken right now so we don't show an invalid streak
        if (data.last_active_date) {
            const todayDate = parseISO(format(new Date(), 'yyyy-MM-dd'));
            const lastActiveDate = parseISO(data.last_active_date);
            const daysDiff = differenceInDays(todayDate, lastActiveDate);
            if (daysDiff > 1) {
                return 0; // It will be reset to 1 on next action anyway
            }
        }

        return data.current_streak || 0;
    } catch (error) {
        console.error('Error in getUserStreak:', error);
        return 0;
    }
}

/**
 * unified function to log a distinct activity and automatically update the user's streak.
 * @param userId - the ID of the user performing the action
 * @param action - a distinct string identifier (e.g. "prompt_enhanced", "llm_compared")
 * @param metadata - optional JSON metadata about the action 
 */
export async function logActivityAndCalculateStreak(userId: string, action: string, metadata: any = null) {
    try {
        // 1. Insert into activity log
        const { error: logError } = await supabaseAdmin
            .from('user_activity_log')
            .insert({
                user_id: userId,
                action,
                metadata
            });

        if (logError) {
            console.error('Failed to insert user_activity_log:', logError);
        }

        // 2. Update streak
        await updateUserStreak(userId);

    } catch (err) {
        console.error('Error in logActivityAndCalculateStreak:', err);
    }
}