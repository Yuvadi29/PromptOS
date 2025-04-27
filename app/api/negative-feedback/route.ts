import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { response } = await req.json();

    const { error } = await supabase.from("prompt_feedback").insert({
      prompt: response,
      feedback: false,
    });

    if (error) {
      console.error('Error storing data:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    console.log('Data Stored Successfully');
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
