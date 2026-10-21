import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      await createAuditLog(
        user.id,
        "LOGIN_FAILED",
        `Failed login attempt for ${email}`,
        req
      );
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "staticflow-jwt-secret"
    );

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    await createAuditLog(
      user.id,
      "USER_LOGIN",
      `User ${email} logged in`,
      req
    );

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
