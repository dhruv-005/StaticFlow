import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, createAuditLog } from "@/lib/auth";
import {
  getEntities,
  updateEntity,
  createEntity,
} from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const res = await getEntities("systemsettings", 1000);
    const settings = res.data.map((s: any) => ({
      id: s.id,
      key: s.name || s.id.toString(),
      value: s.description || s.value?.toString() || "",
      updatedAt: s.createdAt,
    }));
    return NextResponse.json(settings);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin(req);
    const body = await req.json();
    const settings = body.settings as Record<string, string>;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Invalid settings object." },
        { status: 400 }
      );
    }

    const res = await getEntities("systemsettings", 1000);
    for (const [key, value] of Object.entries(settings)) {
      const existing = res.data.find((s: any) => s.name === key);
      if (existing) {
        await updateEntity("systemsettings", existing.id, {
          name: key,
          description: String(value),
        });
      } else {
        await createEntity("systemsettings", {
          name: key,
          description: String(value),
        });
      }
    }

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
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
