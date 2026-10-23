import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";

    const res = await getEntities("users", 10000);
    let users = res.data.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email || "",
      role: (u.role || "USER").toUpperCase(),
      createdAt: u.createdAt,
      _count: { projects: 0, apiKeys: 0 },
    }));

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u: any) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    if (role) {
      users = users.filter(
        (u: any) => u.role === role.toUpperCase()
      );
    }

    const total = users.length;
    const offset = (page - 1) * limit;
    users = users.slice(offset, offset + limit);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN")
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
