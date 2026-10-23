import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isSuperAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    return NextResponse.json({
      user: {
        ...user,
        isSuperAdmin: isSuperAdmin(user.email),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
}
