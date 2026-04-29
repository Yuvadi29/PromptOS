import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "promptos-admin-fallback-secret";

export function verifyAdminToken(token: string): boolean {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;

    const payload = Buffer.from(payloadB64, "base64").toString("utf-8");
    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSig) return false;

    const data = JSON.parse(payload);
    if (data.role !== "admin") return false;
    if (Date.now() > data.exp) return false;

    return true;
  } catch {
    return false;
  }
}
