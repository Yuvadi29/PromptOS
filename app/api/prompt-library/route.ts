import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { logActivityAndCalculateStreak } from '@/lib/streaks';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, promptText, niche } = await req.json();

    if (!title || !description || !promptText || !niche) {
      return NextResponse.json(
        {
          message: 'Missing Data',
        },
        { status: 400 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Save to db
    await supabaseAdmin.from('prompt_library').insert({
      created_by: user.id,
      prompt_title: title,
      prompt_description: description,
      promptText: promptText,
      niche: niche,
    });

    // Update streak & log action
    await logActivityAndCalculateStreak(user.id, 'prompt_library_added', { prompt: title });

    return NextResponse.json(
      {
        message: 'Prompt Added to Library Saved Successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get data from DB with user details
    const { data, error } = await supabaseAdmin
      .from('prompt_library')
      .select(
        `
                *,
                users (
                    name,
                    username,
                    image
                )
            `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    // console.error("Unexpected error:", error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
