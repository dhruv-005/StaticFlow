import { NextRequest, NextResponse } from "next/server";
import { requireAuth, createAuditLog } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const keys = await db.apiKey.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ keys });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { name, projectId } = await req.json();

    const keyCount = await db.apiKey.count({
      where: { userId: session.id },
    });

    if (keyCount >= 10) {
      return NextResponse.json({ error: "Maximum 10 API keys" }, { status: 400 });
    }

    const keyValue = "sf_live_" + crypto.randomBytes(24).toString("hex");

    const apiKey = await db.apiKey.create({
      data: {
        key: keyValue,
        name: name || "Key " + (keyCount + 1),
        userId: session.id,
        projectId: projectId || null,
      },
    });

    await createAuditLog(
      session.id,
      "APIKEY_CREATED",
      `Created API key: ${apiKey.name}`,
      req
    );

    return NextResponse.json({ apiKey }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
