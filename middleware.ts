import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/dashboard and all /api/admin/* routes (except login/logout)
  const isAdminDashboard = pathname.startsWith("/admin/dashboard");
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/logout");

  if (isAdminDashboard || isAdminApi) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      if (isAdminDashboard) {
        // Redirect to admin login page
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      // For API routes, return 401
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token structure and expiry (lightweight check in edge runtime)
    try {
      const [payloadB64] = token.split(".");
      if (!payloadB64) throw new Error("Invalid token");

      const payload = JSON.parse(atob(payloadB64));
      if (payload.role !== "admin" || Date.now() > payload.exp) {
        throw new Error("Token expired or invalid role");
      }
    } catch {
      // Clear the invalid cookie and redirect/reject
      if (isAdminDashboard) {
        const response = NextResponse.redirect(new URL("/admin", request.url));
        response.cookies.set("admin_session", "", { path: "/", maxAge: 0 });
        return response;
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/:path*"],
};
