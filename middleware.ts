import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes are not localized — auth is handled by the admin layout
  // (shows LoginForm for unauthenticated users, no separate login route)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // API routes should not be localized
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Apply i18n middleware to all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except static files and internal Next.js paths
  matcher: ["/((?!_next|.*\\..*).*)"],
};
