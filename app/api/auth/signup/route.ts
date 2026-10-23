import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  storePasswordHash,
  isSuperAdmin,
  createAuditLog,
} from "@/lib/auth";
import { getEntities, createEntity } from "@/lib/render-client";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const res = await getEntities("users", 10000);
    const exists = res.data.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase().trim()
    );

    if (exists) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hash = await hashPassword(password);
    await storePasswordHash(email, hash);

    const role = isSuperAdmin(email) ? "admin" : "user";

    const user = await createEntity("users", {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      isActive: true,
      lastLogin: new Date().toISOString(),
    });

    await createAuditLog(
      String(user?.id || "new"),
      "USER_SIGNUP",
      `New user registered: ${email}`,
      req
    );

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user?.id || Date.now(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role: role.toUpperCase(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Signup failed. Please try again." },
      { status: 500 }
    );
  }
}
