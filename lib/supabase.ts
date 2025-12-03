import { createClient } from '@supabase/supabase-js'

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
let supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

if (process.env.NODE_ENV !== 'production') {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_TEST!,
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST!,
  supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_TEST!
}

// console.log('Node Environment: ', process.env.NODE_ENV);


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});