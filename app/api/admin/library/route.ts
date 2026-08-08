import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('prompt_library')
    .select(
      'id, prompt_title, prompt_description, niche, likes, dislikes, created_at, created_by, users(name, email, image)'
    )
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
