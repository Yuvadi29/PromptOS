import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitStr = searchParams.get('limit');
  const limit = limitStr ? parseInt(limitStr, 10) : null;

  let query = supabase
    .from('users')
    .select('id, name, email, username, created_at')
    .order('created_at', { ascending: false });

  if (limit && !isNaN(limit)) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
