import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { promptId, type } = await req.json();

    if (!promptId || !["likes", "dislikes"].includes(type)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const field = type === "likes" ? "likes" : "dislikes";

    if (type === "likes") {
      const { error } = await supabase
        .rpc('increment_likes', {
          promptid: promptId
        })
      if (error) console.error(error)
    } else {

      const { error } = await supabase
        .rpc('increment_dislikes', {
          promptid: promptId
        })
      if (error) console.error(error)
    }

    return NextResponse.json({ message: `${type} registered` }, { status: 200 });
  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
