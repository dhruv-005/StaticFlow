import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const [
      totalProjects,
      activeKeys,
      totalCalls,
      recentUsage,
      projects,
      notifications,
    ] = await Promise.all([
      db.project.count({ where: { userId } }),
      db.apiKey.count({
        where: { userId, status: "ACTIVE" },
      }),
      db.apiKey.aggregate({
        where: { userId },
        _sum: { calls: true },
      }),
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
          entity: true,
          endpoint: true,
          status: true,
          calls: true,
          recordCount: true,
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

    // Build 7-day chart
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    const dailyUsage = await db.usageRecord.groupBy({
      by: ["createdAt"],
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
      _count: true,
    });

    const chartData: {
      date: string;
      calls: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(
        Date.now() - i * 24 * 60 * 60 * 1000
      );
      const dateStr = d.toISOString().split("T")[0];
      const count = dailyUsage.filter(
        (r) =>
          r.createdAt.toISOString().split("T")[0] ===
          dateStr
      ).length;
      chartData.push({ date: dateStr, calls: count });
    }

    // Average latency
    const avgLatency =
      recentUsage.length > 0
        ? Math.round(
            recentUsage.reduce(
              (s, r) => s + r.latency,
              0
            ) / recentUsage.length
          )
        : 0;

    // Uptime percentage
    const successCount = recentUsage.filter(
      (r) => r.status >= 200 && r.status < 400
    ).length;
    const uptime =
      recentUsage.length > 0
        ? (
            (successCount / recentUsage.length) *
            100
          ).toFixed(1)
        : "100.0";

    return NextResponse.json({
      stats: {
        totalProjects,
        activeKeys,
        totalCalls: totalCalls._sum.calls || 0,
        avgLatency,
        uptime: parseFloat(uptime),
        unreadNotifications: notifications.length,
      },
      chartData,
      recentProjects: projects,
      notifications,
      recentActivity: recentUsage
        .slice(0, 10)
        .map((r) => ({
          id: r.id,
          endpoint: r.endpoint,
          method: r.method,
          status: r.status,
          latency: r.latency,
          createdAt: r.createdAt,
        })),
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
