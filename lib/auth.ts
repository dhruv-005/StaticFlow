import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import {
  getEntities,
  createEntity,
  updateEntity,
} from "@/lib/render-client";

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

export async function storePasswordHash(
  email: string,
  hash: string
): Promise<void> {
  const key = `pwd:${email.toLowerCase().trim()}`;
  try {
    const res = await getEntities("systemsettings", 10000);
    const existing = res.data.find((s: any) => s.name === key);
    if (existing) {
      await updateEntity("systemsettings", existing.id, {
        name: key,
        description: hash,
        category: "PASSWORD",
      });
      console.log("[AUTH] Updated password hash for", email);
    } else {
      await createEntity("systemsettings", {
        name: key,
        description: hash,
        value: 0,
        category: "PASSWORD",
      });
      console.log("[AUTH] Created password hash for", email);
    }
  } catch (err) {
    console.error("[AUTH] Failed to store password hash for", email, err);
    throw err;
  }
}

export async function getPasswordHash(
  email: string
): Promise<string | null> {
  const key = `pwd:${email.toLowerCase().trim()}`;
  try {
    const res = await getEntities("systemsettings", 10000);
    const entry = res.data.find((s: any) => s.name === key);
    console.log("[AUTH] Lookup hash for", email, "found:", !!entry);
    return entry?.description || null;
  } catch (err) {
    console.error("[AUTH] Failed to get hash for", email, err);
    return null;
  }
}

export async function storeResetToken(
  email: string,
  token: string,
  expiresAt: number
): Promise<void> {
  const key = `reset:${email.toLowerCase().trim()}`;
  try {
    const res = await getEntities("systemsettings", 10000);
    const existing = res.data.find((s: any) => s.name === key);
    if (existing) {
      await updateEntity("systemsettings", existing.id, {
        name: key,
        description: token,
        value: expiresAt,
        category: "RESET_TOKEN",
      });
    } else {
      await createEntity("systemsettings", {
        name: key,
        description: token,
        value: expiresAt,
        category: "RESET_TOKEN",
      });
    }
  } catch (err) {
    console.error("[AUTH] Failed to store reset token", err);
    throw err;
  }
}

export async function getResetToken(
  email: string
): Promise<{ token: string; expiresAt: number } | null> {
  const key = `reset:${email.toLowerCase().trim()}`;
  try {
    const res = await getEntities("systemsettings", 10000);
    const entry = res.data.find((s: any) => s.name === key);
    if (!entry) return null;
    return { token: entry.description, expiresAt: entry.value || 0 };
  } catch {
    return null;
  }
}

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
    const res = await getEntities("users", 10000);
    const user = res.data.find(
      (u: any) =>
        u.email === session.user.email ||
        String(u.id) === String(session.user.id)
    );

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

    return {
      id: String(user.id),
      email: user.email,
      name: user.name,
      role: (user.role || "USER").toUpperCase(),
      createdAt: user.createdAt,
      _count: { apiKeys: 0, projects: 0 },
    };
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
    let logUserId = "";

    if (typeof userIdOrParams === "string") {
      logUserId = userIdOrParams;
      logAction = action || "UNKNOWN";
      logDetails = details || "";
    } else {
      logUserId = userIdOrParams.userId || "";
      logAction = userIdOrParams.action;
      logDetails = userIdOrParams.details || "";
    }

    await createEntity("auditlogs", {
      name: logAction,
      description: logDetails,
      value: 0,
      category: logUserId,
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

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
