import { NextRequest, NextResponse } from "next/server";
import { getSession, createAuditLog } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projects = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        apiKeys: {
          select: {
            id: true,
            key: true,
            name: true,
            status: true,
            calls: true,
          },
        },
      },
    });

    return NextResponse.json({ projects });
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

    const body = await req.json();

    const project = await db.project.create({
      data: {
        name: body.name || body.entity + " API",
        description: body.description,
        entity: body.entity,
        endpoint: body.endpoint,
        recordCount: body.recordCount || 100,
        code: body.code,
        userId: session.user.id,
      },
    });

    await createAuditLog({
      action: "PROJECT_CREATED",
      entity: "project",
      entityId: project.id,
      userId: session.user.id,
    });

    return NextResponse.json(
      { project },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
