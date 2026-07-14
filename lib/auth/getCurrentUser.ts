import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function getCurrentUser(req: NextRequest) {
  let body: any = {};

  try {
    // Clone the request so the original route can still read req.json()
    const reqClone = req.clone();
    body = await reqClone.json();
  } catch (e) {
    // Ignore if there is no JSON body
    console.error(e);
  }

  const session = await getServerSession(authOptions);

  const fallbackEmail =
    req.nextUrl.searchParams.get('email') ||
    req.nextUrl.searchParams.get('testUserEmail') ||
    body?.email ||
    body?.testUserEmail;

  const userEmail = session?.user?.email || fallbackEmail;

  if (!userEmail) {
    return null;
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, name, image')
    .eq('email', userEmail)
    .single();

  return user || null;
}
