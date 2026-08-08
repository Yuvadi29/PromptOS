import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Server-only service-role (admin) client. The `server-only` import above makes
// the build fail if this module is ever pulled into a Client Component bundle,
// which is what keeps the service-role key out of the browser. The key is read
// from a non-public env var (NOT NEXT_PUBLIC_*) so it is never inlined into
// client code. The anon client for the browser lives in `lib/supabaseClient.ts`.

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (process.env.NODE_ENV !== 'production') {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_TEST!;
  supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY_TEST!;
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});
