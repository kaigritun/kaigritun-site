import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Handle getthejobai.com
  if (host.includes("getthejobai.com")) {
    // Rewrite to /sites/getthejobai paths
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/sites/getthejobai", request.url));
    }
    // Allow API routes through
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
    // Rewrite other paths
    if (!pathname.startsWith("/sites/")) {
      return NextResponse.rewrite(new URL(`/sites/getthejobai${pathname}`, request.url));
    }
  }

  // Handle gigwithai.com
  if (host.includes("gigwithai.com")) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/sites/gigwithai", request.url));
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
    if (!pathname.startsWith("/sites/")) {
      return NextResponse.rewrite(new URL(`/sites/gigwithai${pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
