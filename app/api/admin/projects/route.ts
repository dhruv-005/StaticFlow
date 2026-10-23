import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20"))
    );
    const search = searchParams.get("search") || "";

    const res = await getEntities("projects", 10000, 0);

    let projects = res.data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      category: p.category || "",
      value: p.value || 0,
      createdAt: p.createdAt,
      updatedAt: p.createdAt,
      user: { id: 1, name: "Admin", email: "admin@staticflow.io" },
      _count: { apiKeys: 0 },
    }));

    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    const total = projects.length;
    const offset = (page - 1) * limit;
    projects = projects.slice(offset, offset + limit);

    return NextResponse.json({ projects, total });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
