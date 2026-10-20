import { NextRequest, NextResponse } from "next/server";
import { getSession, createAuditLog } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const keys = await db.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ keys });
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, projectId, rateLimit } =
      await req.json();

    const keyCount = await db.apiKey.count({
      where: { userId: session.user.id },
    });

    if (keyCount >= 10) {
      return NextResponse.json(
        { error: "Maximum 10 API keys" },
        { status: 400 }
      );
    }

    const key =
      "sf_live_" +
      crypto.randomBytes(24).toString("hex");

    const apiKey = await db.apiKey.create({
      data: {
        key,
        name: name || "Key " + (keyCount + 1),
        userId: session.user.id,
        projectId: projectId || null,
        rateLimit: rateLimit || 1000,
      },
    });

    await createAuditLog({
      action: "APIKEY_CREATED",
      entity: "api_key",
      entityId: apiKey.id,
      userId: session.user.id,
    });

    return NextResponse.json(
      { apiKey },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
