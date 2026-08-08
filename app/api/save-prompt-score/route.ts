import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, clarity, specificity, model_fit, relevance, structure, conciseness } =
      await req.json();

    if (!prompt) {
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

    await supabaseAdmin.from('prompt_scores').insert({
      created_by: user.id,
      prompt,
      clarity,
      specificity,
      model_fit,
      relevance,
      structure,
      conciseness,
    });

    return NextResponse.json(
      {
        message: 'Prompt Saved Successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
