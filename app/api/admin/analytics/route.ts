import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const [
      totalUsers,
      totalProjects,
      totalKeys,
      totalRequests,
      newUsersToday,
      avgLatencyResult,
      topEndpoints,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.apiKey.count(),
      prisma.usageRecord.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.usageRecord.aggregate({ _avg: { latency: true } }),
      prisma.$queryRaw<{ endpoint: string; count: bigint }[]>`
        SELECT endpoint, COUNT(*) as count
        FROM "UsageRecord"
        GROUP BY endpoint
        ORDER BY count DESC
        LIMIT 10
      `,
    ]);

    /* Active users (distinct users with usage in last 7 days) */
    const activeUsersResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "userId") as count
      FROM "UsageRecord"
      WHERE "createdAt" >= ${sevenDaysAgo}
    `;
    const activeUsers = Number(activeUsersResult[0]?.count ?? 0);

    /* Hourly distribution (last 30 days) */
    const hourlyResult = await prisma.$queryRaw<
      { hour: number; count: bigint }[]
    >`
      SELECT EXTRACT(HOUR FROM "createdAt")::int as hour, COUNT(*) as count
      FROM "UsageRecord"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY EXTRACT(HOUR FROM "createdAt")
      ORDER BY hour
    `;
    const hourlyMap: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourlyMap[h] = 0;
    for (const r of hourlyResult) hourlyMap[r.hour] = Number(r.count);
    const hourlyDistribution = Object.entries(hourlyMap).map(
      ([hour, count]) => ({ hour: parseInt(hour), count })
    );

    /* 30-day requests chart */
    const chartResult = await prisma.$queryRaw<
      { date: string; count: bigint }[]
    >`
      SELECT DATE("createdAt")::text as date, COUNT(*) as count
      FROM "UsageRecord"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    /* 30-day new-users chart */
    const usersChartResult = await prisma.$queryRaw<
      { date: string; count: bigint }[]
    >`
      SELECT DATE("createdAt")::text as date, COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    const chartMap: Record<string, { requests: number; users: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      chartMap[key] = { requests: 0, users: 0 };
    }
    for (const r of chartResult)
      if (chartMap[r.date]) chartMap[r.date].requests = Number(r.count);
    for (const r of usersChartResult)
      if (chartMap[r.date]) chartMap[r.date].users = Number(r.count);
    const chart = Object.entries(chartMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));

    /* Uptime = success rate in last 30 days */
    const statusResult = await prisma.$queryRaw<
      { status: number; count: bigint }[]
    >`
      SELECT status, COUNT(*) as count
      FROM "UsageRecord"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY status
    `;
    const totalRecent = statusResult.reduce(
      (sum, s) => sum + Number(s.count),
      0
    );
    const successCount = statusResult
      .filter((s) => s.status >= 200 && s.status < 400)
      .reduce((sum, s) => sum + Number(s.count), 0);
    const uptime =
      totalRecent > 0
        ? Math.round((successCount / totalRecent) * 10000) / 100
        : 100;

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalKeys,
      totalRequests,
      activeUsers,
      newUsersToday,
      avgLatency: Math.round(Number(avgLatencyResult._avg.latency) || 0),
      uptime,
      chart,
      topEndpoints: topEndpoints.map((e) => ({
        endpoint: e.endpoint,
        count: Number(e.count),
      })),
      hourlyDistribution,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("Admin analytics error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
