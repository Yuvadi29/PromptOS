import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_USER = process.env.ADMIN_USER || process.env.NEXT_PUBLIC_ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS || process.env.NEXT_PUBLIC_ADMIN_PASS;
const SECRET = process.env.NEXTAUTH_SECRET || "promptos-admin-fallback-secret";

function createToken(): string {
  const payload = JSON.stringify({
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  const token = Buffer.from(payload).toString("base64") + "." + signature;
  return token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userid, password } = body;

    if (!userid || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    if (userid !== ADMIN_USER || password !== ADMIN_PASS) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = createToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
