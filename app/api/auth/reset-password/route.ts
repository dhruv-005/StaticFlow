import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, createAuditLog } from "@/lib/auth";

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

    const setting = await prisma.systemSetting.findUnique({
      where: { key: `reset:${cleanEmail}` },
    });

    if (!setting) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const parts = setting.value.split(":");
    const storedToken = parts[0];
    const expiresAt = parts.slice(1).join(":");

    if (storedToken !== token) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (new Date(expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const hash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });

    await prisma.systemSetting.delete({
      where: { key: `reset:${cleanEmail}` },
    });

    await createAuditLog(
      user.id,
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
