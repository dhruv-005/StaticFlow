import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ||
    "staticflow-secret-key-change-in-production-32chars!"
);

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/features",
  "/demo",
  "/blog",
];

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

function isAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin")
  );
}

const SUPER_ADMIN_EMAILS = [
  "dhruv@api.com",
  "admin@api.com",
  "vatsal@api.com",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("sf_token")?.value;

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;
    const email = (payload.email as string || "").toLowerCase().trim();

    if (
      isAdminPath(pathname) &&
      role !== "ADMIN" &&
      !SUPER_ADMIN_EMAILS.includes(email)
    ) {
      return NextResponse.redirect(new URL("/overview", req.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.id as string);
    response.headers.set("x-user-role", role);
    response.headers.set("x-user-email", email);

    return response;
  } catch {
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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
