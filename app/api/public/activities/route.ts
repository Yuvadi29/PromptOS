import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_activity_log')
      .select('action, created_at')
      .order('created_at', { ascending: false })
      .limit(15);

    if (error) {
      console.error('Database error in public activities API:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching public activities:', error);
    return NextResponse.json([]);
  }
}
