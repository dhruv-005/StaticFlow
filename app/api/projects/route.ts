import { NextRequest, NextResponse } from "next/server";
import { requireAuth, createAuditLog } from "@/lib/auth";
import { getEntities, createEntity } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const res = await getEntities("projects", 10000);

    const projects = res.data
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        endpoint: `/api/v1/${(p.name || "").toLowerCase().replace(/\s+/g, "-") || p.id}`,
        code: "",
        category: p.category || "",
        value: p.value || 0,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
        apiKeys: [],
      }));

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

    const project = await createEntity("projects", {
      name: body.name || "New API",
      description: `${body.description || ""}\n\n---ENDPOINT---\n${body.endpoint || ""}\n\n---CODE---\n${body.code || ""}`,
      value: 0,
      category: "API",
    });

    await createAuditLog(
      session.id,
      "PROJECT_CREATED",
      `Created project: ${body.name || "New API"}`,
      req
    );

    return NextResponse.json(
      {
        project: {
          id: project?.id || Date.now(),
          name: body.name || "New API",
          description: body.description || "",
          endpoint: body.endpoint || "",
          code: body.code || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
