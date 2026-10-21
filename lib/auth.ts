import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ||
    process.env.JWT_SECRET ||
    "staticflow-secret-key-change-in-production-32chars!"
);

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

/* ── Password ── */

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

  return user;
}

/* ── Auth guards ── */

export async function requireAuth(_req?: NextRequest): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

export async function requireAdmin(_req?: NextRequest): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/* ── Audit log — accepts BOTH calling styles ── */

export async function createAuditLog(
  userIdOrParams: string | { action: string; entity: string; entityId?: string; details?: string; userId?: string; ip?: string; userAgent?: string },
  action?: string,
  details?: string,
  _req?: NextRequest
) {
  try {
    if (typeof userIdOrParams === "string") {
      // Called as: createAuditLog(userId, action, details, req)
      await prisma.auditLog.create({
        data: {
          action: action || "UNKNOWN",
          details: details || null,
          userId: userIdOrParams,
        },
      });
    } else {
      // Called as: createAuditLog({ action, entity, ... })
      await prisma.auditLog.create({
        data: {
          action: userIdOrParams.action,
          details: userIdOrParams.details || null,
          userId: userIdOrParams.userId || null,
          ipAddress: userIdOrParams.ip || null,
        },
      });
    }
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

/* ── Usage tracking — accepts BOTH calling styles ── */

export async function trackUsage(
  userIdOrParams: string | { endpoint: string; method: string; status: number; latency: number; userId?: string },
  endpoint?: string,
  method?: string,
  status?: number,
  latency?: number
) {
  try {
    if (typeof userIdOrParams === "string") {
      // Called as: trackUsage(userId, endpoint, method, status, latency)
      await prisma.usageRecord.create({
        data: {
          endpoint: endpoint || "/unknown",
          method: method || "GET",
          status: status || 200,
          latency: latency || 0,
          userId: userIdOrParams,
        },
      });
    } else {
      // Called as: trackUsage({ endpoint, method, ... })
      await prisma.usageRecord.create({
        data: {
          endpoint: userIdOrParams.endpoint,
          method: userIdOrParams.method,
          status: userIdOrParams.status,
          latency: userIdOrParams.latency,
          userId: userIdOrParams.userId || null,
        },
      });
    }
  } catch (e) {
    console.error("Usage tracking failed:", e);
  }
}

export { prisma };
