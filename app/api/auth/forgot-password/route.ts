import { NextRequest, NextResponse } from "next/server";
import { storeResetToken } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const res = await getEntities("users", 10000);
    const user = res.data.find(
      (u: any) => u.email?.toLowerCase() === cleanEmail
    );

    if (!user) {
      return NextResponse.json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000;

    await storeResetToken(cleanEmail, token, expiresAt);

    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
      resetToken: token,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
