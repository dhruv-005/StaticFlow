import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { requireAdmin, createAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const settings = await db.systemSetting.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json(settings);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin(req);
    const body = await req.json();
    const settings = body.settings as Record<string, string>;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings object." }, { status: 400 });
    }

    const ops = Object.entries(settings).map(([key, value]) =>
      db.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await db.$transaction(ops);

    await createAuditLog(
      session.id,
      "SETTINGS_UPDATE",
      `Updated ${Object.keys(settings).length} settings`,
      req
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
