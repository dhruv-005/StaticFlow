import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [projectsRes, keysRes, usageRes, notifRes] = await Promise.all([
      getEntities("projects", 10000),
      getEntities("apikeys", 10000),
      getEntities("usagerecords", 10000),
      getEntities("notifications", 10000),
    ]);

    const projects = projectsRes.data;
    const keys = keysRes.data;
    const usage = usageRes.data;
    const notifications = notifRes.data;

    const totalProjects = projectsRes.total;
    const activeKeys = keys.filter(
      (k: any) => (k.category || "").toUpperCase() !== "REVOKED"
    ).length;
    const totalCalls = usageRes.total;

    const recentUsage = usage
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 50);

    const recentProjects = projects
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        endpoint: `/api/v1/${p.name?.toLowerCase().replace(/\s+/g, "-") || p.id}`,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
      }));

    const unreadNotifs = notifications.filter(
      (n: any) => (n.category || "").toUpperCase() !== "READ"
    );

    const dailyUsage = usage.filter(
      (u: any) => new Date(u.createdAt) >= sevenDaysAgo
    );

    const chartData: { date: string; calls: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const count = dailyUsage.filter(
        (r: any) =>
          new Date(r.createdAt).toISOString().split("T")[0] === dateStr
      ).length;
      chartData.push({ date: dateStr, calls: count });
    }

    const avgLatency =
      recentUsage.length > 0
        ? Math.round(
            recentUsage.reduce(
              (s: number, r: any) => s + (r.value || 0),
              0
            ) / recentUsage.length
          )
        : 0;

    const successCount = recentUsage.filter(
      (r: any) => r.value >= 0 && r.value < 400
    ).length;
    const uptime =
      recentUsage.length > 0
        ? parseFloat(
            ((successCount / recentUsage.length) * 100).toFixed(1)
          )
        : 100.0;

    return NextResponse.json({
      stats: {
        totalProjects,
        activeKeys,
        totalCalls,
        avgLatency,
        uptime,
        unreadNotifications: unreadNotifs.length,
      },
      chartData,
      recentProjects,
      notifications: unreadNotifs.slice(0, 10).map((n: any) => ({
        id: n.id,
        title: n.name || "Notification",
        message: n.description || "",
        read: false,
        createdAt: n.createdAt,
      })),
      recentActivity: recentUsage.slice(0, 10).map((r: any) => ({
        id: r.id,
        endpoint: r.category || "/api/unknown",
        method: r.name || "GET",
        status: Math.round(r.value || 200),
        latency: Math.round(r.value || 0),
        createdAt: r.createdAt,
      })),
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
