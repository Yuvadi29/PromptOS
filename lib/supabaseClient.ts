import { createClient } from '@supabase/supabase-js';

// Anon (public) Supabase client. Safe to import from Client Components — it uses
// the public anon key and every request is still constrained by your RLS
// policies. The service-role client lives in `lib/supabase.ts`, which is
// server-only so its key can never reach the browser.

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (process.env.NODE_ENV !== 'production') {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_TEST!;
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST!;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
