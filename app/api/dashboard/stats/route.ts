import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = session.id;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalProjects,
      activeKeys,
      totalCalls,
      recentUsage,
      projects,
      notifications,
    ] = await Promise.all([
      db.project.count({ where: { userId } }),
      db.apiKey.count({ where: { userId, status: "ACTIVE" } }),
      db.usageRecord.count({ where: { userId } }),
      db.usageRecord.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.project.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          description: true,
          endpoint: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.notification.findMany({
        where: { userId, read: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const dailyUsage = await db.usageRecord.findMany({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    });

    const chartData: { date: string; calls: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const count = dailyUsage.filter(
        (r) => r.createdAt.toISOString().split("T")[0] === dateStr
      ).length;
      chartData.push({ date: dateStr, calls: count });
    }

    const avgLatency =
      recentUsage.length > 0
        ? Math.round(
            recentUsage.reduce((s, r) => s + r.latency, 0) / recentUsage.length
          )
        : 0;

    const successCount = recentUsage.filter(
      (r) => r.status >= 200 && r.status < 400
    ).length;
    const uptime =
      recentUsage.length > 0
        ? ((successCount / recentUsage.length) * 100).toFixed(1)
        : "100.0";

    return NextResponse.json({
      stats: {
        totalProjects,
        activeKeys,
        totalCalls,
        avgLatency,
        uptime: parseFloat(uptime),
        unreadNotifications: notifications.length,
      },
      chartData,
      recentProjects: projects,
      notifications,
      recentActivity: recentUsage.slice(0, 10).map((r) => ({
        id: r.id,
        endpoint: r.endpoint,
        method: r.method,
        status: r.status,
        latency: r.latency,
        createdAt: r.createdAt,
      })),
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
