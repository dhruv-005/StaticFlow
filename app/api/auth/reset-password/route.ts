import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  storePasswordHash,
  getResetToken,
  createAuditLog,
} from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function POST(req: NextRequest) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: "Email, token, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const stored = await getResetToken(cleanEmail);

    if (!stored) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (stored.token !== token) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    const res = await getEntities("users", 10000);
    const user = res.data.find(
      (u: any) => u.email?.toLowerCase() === cleanEmail
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const hash = await hashPassword(newPassword);
    await storePasswordHash(cleanEmail, hash);

    await createAuditLog(
      String(user.id),
      "PASSWORD_RESET",
      `Password reset for ${cleanEmail}`,
      req
    );

    return NextResponse.json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
