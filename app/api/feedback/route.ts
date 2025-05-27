// /app/api/feedback/route.ts
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { response, feedback } = await req.json(); // feedback: true or false

    if (typeof feedback !== "boolean") {
      return NextResponse.json({ success: false, message: "Invalid feedback type" }, { status: 400 });
    }

    // Get user_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = userData.id;

    // Prevent duplicate feedback
    const { data: existing } = await supabase
      .from("prompt_feedback")
      .select("id")
      .eq("user_id", userId)
      .eq("prompt", response)
      .single();

    if (existing) {
      return NextResponse.json({ success: false, message: "Feedback already submitted" }, { status: 409 });
    }

    const { error: insertError } = await supabase.from("prompt_feedback").insert({
      user_id: userId,
      prompt: response,
      feedback: feedback,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ success: false, message: "Error saving feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
