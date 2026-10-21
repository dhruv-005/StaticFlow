import { NextRequest, NextResponse } from "next/server";
import { requireAuth, createAuditLog } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const projects = await db.project.findMany({
      where: { userId: session.id },
      orderBy: { updatedAt: "desc" },
      include: {
        apiKeys: {
          select: { id: true, key: true, name: true, status: true },
        },
      },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    const project = await db.project.create({
      data: {
        name: body.name || "New API",
        description: body.description || "",
        endpoint: body.endpoint || "",
        code: body.code || "",
        userId: session.id,
      },
    });

    await createAuditLog(
      session.id,
      "PROJECT_CREATED",
      `Created project: ${project.name}`,
      req
    );

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
