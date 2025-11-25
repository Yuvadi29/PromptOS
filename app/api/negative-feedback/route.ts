import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { response } = await req.json();

    const { error } = await supabaseAdmin.from("prompt_feedback").insert({
      prompt: response,
      feedback: false,
    });

    if (error) {
      console.error('Error storing data:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
