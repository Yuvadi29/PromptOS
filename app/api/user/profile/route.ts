import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { bio, location, job_title, social_links } = body;

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        bio,
        location,
        job_title,
        social_links, // Expected to be a valid JSON object or null
      })
      .eq('email', session.user.email);

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
