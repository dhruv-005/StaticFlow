import { NextRequest, NextResponse } from "next/server";
import { requireAuth, createAuditLog } from "@/lib/auth";
import { getEntityById, deleteEntity } from "@/lib/render-client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);

    let project;
    try {
      project = await getEntityById("projects", params.id);
    } catch {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description || "",
        endpoint: `/api/v1/${(project.name || "").toLowerCase().replace(/\s+/g, "-") || project.id}`,
        code: "",
        category: project.category || "",
        value: project.value || 0,
        createdAt: project.createdAt,
        updatedAt: project.createdAt,
        apiKeys: [],
      },
    });
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

    try {
      await deleteEntity("projects", params.id);
    } catch {
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
