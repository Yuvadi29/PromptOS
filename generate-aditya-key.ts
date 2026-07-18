import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

function generateAPIKey() {
  const bytes = crypto.randomBytes(32);
  const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let keyStr = '';
  for (let i = 0; i < bytes.length; i++) {
    keyStr += base62[bytes[i] % 62];
  }
  const prefix = 'pmt';
  const key = `sk_${prefix}_${keyStr}`;
  return { key, prefix };
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL_TEST || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_TEST ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function main() {
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .ilike('email', '%letstalkaditya%');

  if (error) {
    return;
  }

  if (!users || users.length === 0) {
    return;
  }

  const user = users[0];

  const { key, prefix } = generateAPIKey();

  // Actually, lib/auth/hash.ts in PromptOS uses Web Crypto, but sha256 is standard.
  // Wait, let's use WebCrypto just in case.
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedKey = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  const { error: apiError } = await supabaseAdmin
    .from('api_keys')
    .insert({
      user_id: user.id,
      name: 'test_aditya_key',
      prefix,
      key_hash: hashedKey,
    })
    .select()
    .single();

  if (apiError) {
    return;
  }
}

main().catch(console.error);
