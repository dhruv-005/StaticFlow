import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  getPasswordHash,
  isSuperAdmin,
  createToken,
  createAuditLog,
} from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const res = await getEntities("users", 10000);
    const user = res.data.find(
      (u: any) => u.email?.toLowerCase() === cleanEmail
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const hash = await getPasswordHash(cleanEmail);

    if (!hash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, hash);

    if (!valid) {
      await createAuditLog(
        String(user.id),
        "LOGIN_FAILED",
        `Failed login attempt for ${cleanEmail}`,
        req
      );
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const role = isSuperAdmin(cleanEmail)
      ? "ADMIN"
      : (user.role || "USER").toUpperCase();

    const token = await createToken({
      id: String(user.id),
      email: cleanEmail,
      name: user.name,
      role: role as "USER" | "ADMIN",
    });

    await createAuditLog(
      String(user.id),
      "USER_LOGIN",
      `User ${cleanEmail} logged in`,
      req
    );

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: cleanEmail,
        name: user.name,
        role,
      },
    });

    response.cookies.set("sf_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
