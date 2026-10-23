import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  verifyPassword,
  isSuperAdmin,
  createToken,
  createAuditLog,
} from "@/lib/auth";

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

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      await createAuditLog(
        user.id,
        "LOGIN_FAILED",
        `Failed login for ${cleanEmail}`,
        req
      );
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const role = isSuperAdmin(cleanEmail)
      ? "ADMIN"
      : user.role;

    const token = await createToken({
      id: user.id,
      email: cleanEmail,
      name: user.name,
      role: role as "USER" | "ADMIN",
    });

    await createAuditLog(
      user.id,
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
