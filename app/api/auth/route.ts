import { NextRequest, NextResponse } from "next/server";
import { getSession, createAuditLog } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (session) {
    await createAuditLog({
      action: "USER_LOGOUT",
      entity: "user",
      entityId: session.user.id,
      userId: session.user.id,
    });
  }

  const response = NextResponse.json({
    message: "Logged out",
  });

  response.cookies.set("sf_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
