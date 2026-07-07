import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { count: usersCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: promptsCount } = await supabaseAdmin
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    const { data: typesData } = await supabaseAdmin.from('prompts').select('prompt_type');

    const uniqueTypes = new Set(typesData?.map((p) => p.prompt_type).filter(Boolean));
    const typesCount = Math.max(uniqueTypes.size, 10);

    return NextResponse.json({
      usersCount,
      promptsCount,
      typesCount,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
