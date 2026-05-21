import { buildUserPreferencexs } from "@/lib/personlization/buildUserPreferences";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const { userId } = body;

    if (!userId) {
        return NextResponse.json(
            { error: "Missing userId" },
            { status: 400 }
        );
    }

    const result = await buildUserPreferencexs(userId);

    return NextResponse.json(result);
}