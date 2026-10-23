import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const [projectsRes, usageRes, keysRes] = await Promise.all([
      getEntities("projects", 10000),
      getEntities("usagerecords", 10000),
      getEntities("apikeys", 10000),
    ]);

    const totalProjects = projectsRes.total;
    const totalCalls = usageRes.total;

    const avgLatency =
      usageRes.data.length > 0
        ? Math.round(
            usageRes.data.reduce(
              (s: number, u: any) => s + (u.value || 0),
              0
            ) / usageRes.data.length
          )
        : 0;

    const activeKeys = keysRes.data.filter(
      (k: any) => (k.category || "").toUpperCase() !== "REVOKED"
    ).length;

    const recentProjects = projectsRes.data
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        endpoint: `/api/v1/${(p.name || "").toLowerCase().replace(/\s+/g, "-") || p.id}`,
        updatedAt: p.createdAt,
      }));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsage = usageRes.data.filter(
      (u: any) => new Date(u.createdAt) >= sevenDaysAgo
    );

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const calls = recentUsage.filter(
        (r: any) =>
          new Date(r.createdAt).toISOString().split("T")[0] === dateStr
      ).length;
      chartData.push({ label, calls });
    }

    return NextResponse.json({
      totalProjects,
      totalCalls,
      avgLatency,
      activeKeys,
      chartData,
      recentProjects,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
