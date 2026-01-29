
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const BADGES_TO_SEED = [
    // 🏅 Prompt Explorer
    {
        name: 'Prompt Explorer',
        description: 'First steps into prompt intelligence.',
        icon: 'Compass',
        category: 'Explorer',
        criteria_key: 'prompts_created',
        criteria_threshold: 5
    },
    {
        name: 'First Optimizer',
        description: 'Understood prompt enhancement.',
        icon: 'Sparkles',
        category: 'Explorer',
        criteria_key: 'prompts_enhanced',
        criteria_threshold: 1
    },
    // 🔵 Consistency & Habit
    {
        name: 'Daily Prompter',
        description: 'Building the habit.',
        icon: 'Sun',
        category: 'Consistency',
        criteria_key: 'days_active',
        criteria_threshold: 3
    },
    {
        name: 'Weekly Builder',
        description: 'Consistency beats intensity.',
        icon: 'Calendar',
        category: 'Consistency',
        criteria_key: 'prompts_created', // Simplified for MVP or need 'weekly_active'
        criteria_threshold: 20
    },
    {
        name: 'PromptOS Regular',
        description: 'PromptOS is part of your workflow.',
        icon: 'UserCheck',
        category: 'Consistency',
        criteria_key: 'days_active',
        criteria_threshold: 30
    },
    // 🟠 Prompt Quality & Learning
    {
        name: 'Prompt Improver',
        description: 'You don’t just write — you refine.',
        icon: 'Edit3',
        category: 'Quality',
        criteria_key: 'prompts_enhanced',
        criteria_threshold: 10
    },
    {
        name: 'Versioning Pro',
        description: 'Treats prompts like code.',
        icon: 'GitBranch',
        category: 'Quality',
        criteria_key: 'prompt_versions',
        criteria_threshold: 25
    },
    {
        name: 'Feedback Loop Master',
        description: 'Learns from outcomes.',
        icon: 'MessageCircle',
        category: 'Quality',
        criteria_key: 'feedback_given',
        criteria_threshold: 20
    },
    // 🟣 Advanced Feature Adoption
    {
        name: 'Prompt Analyst',
        description: 'Looks under the hood.',
        icon: 'BarChart2',
        category: 'Advanced',
        criteria_key: 'prompt_scores_viewed',
        criteria_threshold: 10
    },
    {
        name: 'LLM Comparator',
        description: 'Model-aware prompting.',
        icon: 'Scale',
        category: 'Advanced',
        criteria_key: 'prompt_comparisons',
        criteria_threshold: 5
    },
    {
        name: 'Prompt Architect',
        description: 'Designs prompts, not sentences.',
        icon: 'Ruler',
        category: 'Advanced',
        criteria_key: 'structured_prompts',
        criteria_threshold: 10
    },
    // 🟡 Community & Knowledge
    {
        name: 'Knowledge Contributor',
        description: 'Shares what they learn.',
        icon: 'BookOpen',
        category: 'Community',
        criteria_key: 'blogs_published',
        criteria_threshold: 1
    }
];

export async function GET() {
    try {
        const results = [];
        for (const badge of BADGES_TO_SEED) {
            // Check if exists
            const { data: existing } = await supabaseAdmin
                .from('badges')
                .select('id')
                .eq('name', badge.name)
                .single();

            if (!existing) {
                const { data, error } = await supabaseAdmin
                    .from('badges')
                    .insert(badge)
                    .select()
                    .single();

                if (error) throw error;
                results.push({ ...badge, status: 'inserted', id: data.id });
            } else {
                // Optional: Update if needed? For now just skip
                results.push({ ...badge, status: 'skipped', id: existing.id });
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
