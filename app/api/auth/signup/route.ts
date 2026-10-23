import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
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

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const res = await getEntities("users", 10000);
    const exists = res.data.find(
      (u: any) => u.email?.toLowerCase() === cleanEmail
    );

    if (exists) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hash = await hashPassword(password);
    const role = isSuperAdmin(cleanEmail) ? "admin" : "user";

    const user = await createEntity("users", {
      name: name.trim(),
      email: cleanEmail,
      role,
      description: hash,
      isActive: true,
      lastLogin: new Date().toISOString(),
    });

    console.log("[SIGNUP] Created user:", cleanEmail, "role:", role, "hash stored in description");

    await createAuditLog(
      String(user?.id || "new"),
      "USER_SIGNUP",
      `New user registered: ${cleanEmail}`,
      req
    );

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user?.id || Date.now(),
          name: name.trim(),
          email: cleanEmail,
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
