import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { createEntity } from "@/lib/render-client";

/* ── Constants ── */

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ||
    process.env.JWT_SECRET ||
    "staticflow-secret-key-change-in-production-32chars!"
);

export const SUPER_ADMIN_EMAILS = [
  "dhruv@api.com",
  "admin@api.com",
  "vatsal@api.com",
];

/* ── Types ── */

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
}

export interface Session {
  user: SessionUser;
  expires: string;
}

/* ── Helpers ── */

export function isSuperAdmin(email: string): boolean {
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ── JWT ── */

export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string) || null,
      role: (payload.role as "USER" | "ADMIN") || "USER",
    };
  } catch {
    return null;
  }
}

/* ── Session ── */

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("sf_token")?.value;
  if (!token) return null;

  const user = await verifyToken(token);
  if (!user) return null;

  return {
    user,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            apiKeys: true,
            projects: true,
          },
        },
      },
    });

    if (!user) {
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        createdAt: new Date().toISOString(),
        _count: { apiKeys: 0, projects: 0 },
      };
    }

    return user;
  } catch {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      createdAt: new Date().toISOString(),
      _count: { apiKeys: 0, projects: 0 },
    };
  }
}

/* ── Auth Guards ── */

export async function requireAuth(
  _req?: NextRequest
): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

export async function requireAdmin(
  _req?: NextRequest
): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && !isSuperAdmin(user.email)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireSuperAdmin(
  _req?: NextRequest
): Promise<SessionUser> {
  const user = await requireAuth();
  if (!isSuperAdmin(user.email)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/* ── Audit Log (uses Prisma / Supabase) ── */

export async function createAuditLog(
  userIdOrParams:
    | string
    | {
        action: string;
        entity?: string;
        entityId?: string;
        details?: string;
        userId?: string;
        ip?: string;
        userAgent?: string;
      },
  action?: string,
  details?: string,
  _req?: NextRequest
) {
  try {
    let logAction = "UNKNOWN";
    let logDetails = "";
    let logUserId: string | null = null;

    if (typeof userIdOrParams === "string") {
      logUserId = userIdOrParams;
      logAction = action || "UNKNOWN";
      logDetails = details || "";
    } else {
      logUserId = userIdOrParams.userId || null;
      logAction = userIdOrParams.action;
      logDetails = userIdOrParams.details || "";
    }

    const { prisma } = await import("@/lib/db/prisma");
    await prisma.auditLog.create({
      data: {
        action: logAction,
        details: logDetails || null,
        userId: logUserId,
      },
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

/* ── Usage Tracking (uses Render) ── */

export async function trackUsage(
  userIdOrParams:
    | string
    | {
        endpoint: string;
        method: string;
        status: number;
        latency: number;
        userId?: string;
      },
  endpoint?: string,
  method?: string,
  status?: number,
  latency?: number
) {
  try {
    let ep = "/unknown";
    let meth = "GET";
    let stat = 200;
    let lat = 0;

    if (typeof userIdOrParams === "string") {
      ep = endpoint || "/unknown";
      meth = method || "GET";
      stat = status || 200;
      lat = latency || 0;
    } else {
      ep = userIdOrParams.endpoint;
      meth = userIdOrParams.method;
      stat = userIdOrParams.status;
      lat = userIdOrParams.latency;
    }

    await createEntity("usagerecords", {
      name: meth,
      description: ep,
      value: stat,
      category: ep,
    });
  } catch (e) {
    console.error("Usage tracking failed:", e);
  }
}
