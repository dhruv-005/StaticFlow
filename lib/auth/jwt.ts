import crypto from "crypto";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "staticflow-dev-secret-key-change-in-production";

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function base64UrlEncode(data: string): string {
  return Buffer.from(data)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(data: string): string {
  const padded = data + "=".repeat((4 - (data.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf-8");
}

function sign(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function generateToken(
  userId: string,
  email: string,
  role: string = "user",
  expiresInHours: number = 24
): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: userId,
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInHours * 3600,
    })
  );
  const signature = sign(`${header}.${payload}`, JWT_SECRET);

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    const expectedSignature = sign(`${header}.${payload}`, JWT_SECRET);
    if (signature !== expectedSignature) return null;

    const decoded: JWTPayload = JSON.parse(base64UrlDecode(payload));

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }

    return decoded;
  } catch {
    return null;
  }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}
