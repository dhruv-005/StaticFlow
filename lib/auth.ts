import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ||
    "staticflow-secret-key-change-in-production-32chars!"
);

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  avatar: string | null;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(
  user: SessionUser
): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
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
      role:
        (payload.role as "USER" | "ADMIN") || "USER",
      avatar: (payload.avatar as string) || null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("sf_token")?.value;
  if (!token) return null;

  const user = await verifyToken(token);
  if (!user) return null;

  return {
    user,
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
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
      avatar: true,
      bio: true,
      company: true,
      verified: true,
      lastLoginAt: true,
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

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function createAuditLog(params: {
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}) {
  try {
    await prisma.auditLog.create({ data: params });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

export async function trackUsage(params: {
  endpoint: string;
  method: string;
  status: number;
  latency: number;
  bytes?: number;
  userId?: string;
}) {
  try {
    await prisma.usageRecord.create({
      data: {
        endpoint: params.endpoint,
        method: params.method,
        status: params.status,
        latency: params.latency,
        bytes: params.bytes || 0,
        userId: params.userId,
      },
    });
  } catch (e) {
    console.error("Usage tracking failed:", e);
  }
}

export { prisma };
