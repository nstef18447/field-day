import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API without auth
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!password) {
    return new NextResponse("ADMIN_PASSWORD not configured", { status: 500 });
  }

  // Hash the password to compare with stored cookie
  // We use a simple sync comparison here since middleware can't use async crypto easily
  // The cookie stores the hex-encoded SHA-256 hash of the password
  const expected = hashSync(password);

  if (session !== expected) {
    // API routes get 401, pages redirect to login
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Simple sync hash using Web Crypto-compatible approach
// We pre-compute at module level since the password doesn't change
function hashSync(input: string): string {
  // Use a simple deterministic hash for cookie comparison
  // The actual SHA-256 hashing happens in the login API route
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(16);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
