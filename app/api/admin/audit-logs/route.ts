import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    const res = await getEntities("auditlogs", limit, offset);

    const logs = res.data.map((log: any) => ({
      id: log.id,
      action: log.name || "UNKNOWN",
      details: log.description || "",
      userName: log.category || "System",
      createdAt: log.createdAt,
      ipAddress: "—",
    }));

    return NextResponse.json({
      logs,
      pagination: {
        total: res.total,
        page,
        limit,
        pages: Math.ceil(res.total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN")
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
