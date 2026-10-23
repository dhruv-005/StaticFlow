import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ||
    "staticflow-secret-key-change-in-production-32chars!"
);

// Paths anyone can access without login
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/features",
  "/demo",
  "/blog",
];

// Check if path is public
function isPublic(pathname: string): boolean {
  return (
    PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    ) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  );
}

// Check if path requires admin
function isAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let public paths through
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Let non-admin API routes through (they handle their own auth)
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = req.cookies.get("sf_token")?.value;

  if (!token) {
    // No token — redirect to login
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    // Admin-only paths — block non-admins
    if (isAdminPath(pathname) && role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/overview", req.url)
      );
    }

    // Add user info to headers for server components
    const response = NextResponse.next();
    response.headers.set(
      "x-user-id",
      payload.id as string
    );
    response.headers.set("x-user-role", role);
    response.headers.set(
      "x-user-email",
      payload.email as string
    );

    return response;
  } catch {
    // Invalid or expired token — clear cookie and redirect
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(url);
    response.cookies.set("sf_token", "", {
      maxAge: 0,
      path: "/",
    });
    return response;
  }
}

// Only run middleware on these paths
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
