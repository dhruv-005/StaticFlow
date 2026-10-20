import { NextRequest, NextResponse } from "next/server";
import { getSession, createAuditLog } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const project = await db.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: { apiKeys: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const deleted = await db.project.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    await createAuditLog({
      action: "PROJECT_DELETED",
      entity: "project",
      entityId: params.id,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
