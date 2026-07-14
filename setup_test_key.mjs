import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function hashAPIKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

async function setup() {
  // 1. Get a user id
  const { data: user } = await supabase.from('users').select('id').limit(1).single();
  
  if (!user) {
    console.error("No user found in the DB. Please sign in once first.");
    return;
  }

  const key = "sk_live_pm" + crypto.randomBytes(32).toString("hex");
  const prefix = "sk_live_pm";
  const hashed = hashAPIKey(key);

  const { data, error } = await supabase.from('api_keys').insert({
    user_id: user.id,
    name: "Test API Key for Postman",
    prefix,
    key_hash: hashed,
    is_active: true
  }).select().single();

  if (error) {
    console.error("Error inserting key:", error);
  } else {
    console.log("Success! Use this API Key:");
    console.log(key);
  }
}

setup();
