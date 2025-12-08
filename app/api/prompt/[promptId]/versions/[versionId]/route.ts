import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ promptId: string; versionId: string }> }
) {
  const { versionId } = await params;

  const { data, error } = await supabaseAdmin
    .from("prompt_versions")
    .select("id, prompt_id, version_number, content, created_at, source, reason")
    .eq("id", versionId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Version not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}