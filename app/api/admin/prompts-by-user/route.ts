import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  // Fetch users along with the prompts they created
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      image,
      prompts:prompts!created_by (
        id,
        prompt_value
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map users to include prompt counts and actual prompts
  const usersWithPromptCounts = data
    .map((user) => ({
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_image: user.image || null,
      prompt_count: user.prompts?.length || 0,
      prompts: user.prompts?.map((p: any) => p.prompt_value) || [],
    }))
    // Sort descending by prompt_count
    .sort((a, b) => b.prompt_count - a.prompt_count);

  return NextResponse.json(usersWithPromptCounts);
}
