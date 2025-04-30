import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { promptId, type } = await req.json();

    if (!promptId || !["like", "dislike"].includes(type)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const field = type === "like" ? "likes" : "dislikes";

    const { error } = await supabase.rpc(`increment_${field}`, {
      prompt_id: promptId,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `${type} registered` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
