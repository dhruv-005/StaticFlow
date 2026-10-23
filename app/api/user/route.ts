import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const data: Record<string, string> = {};
    if (body.name) data.name = body.name;

    if (Object.keys(data).length === 0)
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

    const user = await db.user.update({
      where: { id: session.id },
      data,
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
