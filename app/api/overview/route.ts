import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = session.id;

    const [totalProjects, totalCalls, avgResult, activeKeys, recentProjects] =
      await Promise.all([
        db.project.count({ where: { userId } }),
        db.usageRecord.count({ where: { userId } }),
        db.usageRecord.aggregate({
          where: { userId },
          _avg: { latency: true },
        }),
        db.apiKey.count({ where: { userId, status: "ACTIVE" } }),
        db.project.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            description: true,
            endpoint: true,
            updatedAt: true,
          },
        }),
      ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsage = await db.usageRecord.findMany({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const calls = recentUsage.filter(
        (r) => r.createdAt.toISOString().split("T")[0] === dateStr
      ).length;
      chartData.push({ label, calls });
    }

    return NextResponse.json({
      totalProjects,
      totalCalls,
      avgLatency: Math.round(avgResult._avg.latency || 0),
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
