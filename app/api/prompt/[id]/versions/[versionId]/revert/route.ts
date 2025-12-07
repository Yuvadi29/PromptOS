import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string; versionId: string } }
) {
  const { id, versionId } = await params;

  // Step 1 — load old version
  const { data: old, error: oldErr } = await supabaseAdmin
    .from("prompt_versions")
    .select("*")
    .eq("id", versionId)
    .single();

  if (oldErr || !old) {
    return NextResponse.json(
      { error: oldErr?.message || "Version not found" },
      { status: 404 }
    );
  }

  // Step 2 — insert new version copying content
  const { data: newVersion, error: insertErr } = await supabaseAdmin
    .from("prompt_versions")
    .insert([
      {
        prompt_id: id,
        content: old.content,
        source: "revert",
        reason: `Reverted to version ${old.version_number} (${old.id})`
      }
    ])
    .select()
    .single();

  if (insertErr) {
    console.error(insertErr);
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json(
    { new_version: newVersion },
    { status: 201 }
  );
}
