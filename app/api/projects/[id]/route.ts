import { NextRequest, NextResponse } from "next/server";
import { requireAuth, createAuditLog } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);

    const project = await db.project.findFirst({
      where: { id: params.id, userId: session.id },
      include: { apiKeys: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);

    const deleted = await db.project.deleteMany({
      where: { id: params.id, userId: session.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await createAuditLog(
      session.id,
      "PROJECT_DELETED",
      `Deleted project ${params.id}`,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
