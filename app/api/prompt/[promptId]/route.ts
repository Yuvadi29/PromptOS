import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

async function getCurrentUserId(email: string): Promise<string | undefined> {
  const { data } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
  return data?.id as string | undefined;
}

// GET /api/prompt/:promptId
// Returns the base prompt plus its versions for the prompt editor, scoped to the
// owner. Previously the editor read this directly with the service-role client
// in the browser.
export async function GET(_req: Request, { params }: { params: Promise<{ promptId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = await getCurrentUserId(session.user.email);
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { promptId } = await params;

    const { data: prompt, error } = await supabaseAdmin
      .from('prompts')
      .select('id, prompt_value, created_at, created_by')
      .eq('id', promptId)
      .single();

    if (error || !prompt) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (prompt.created_by !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: versions } = await supabaseAdmin
      .from('prompt_versions')
      .select('*')
      .eq('prompt_id', promptId)
      .order('version_number', { ascending: false });

    return NextResponse.json(
      {
        id: prompt.id,
        prompt_value: prompt.prompt_value,
        created_at: prompt.created_at,
        versions: versions ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/prompt/:promptId — delete a prompt the signed-in user owns.
// The delete is scoped by `created_by`, so a user can no longer delete another
// user's prompt (the old client-side admin delete had no such check).
export async function DELETE(_req: Request, { params }: { params: Promise<{ promptId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = await getCurrentUserId(session.user.email);
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { promptId } = await params;

    const { data, error } = await supabaseAdmin
      .from('prompts')
      .delete()
      .eq('id', promptId)
      .eq('created_by', userId)
      .select('id');

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
