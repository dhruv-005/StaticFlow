import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const [usersRes, projectsRes, keysRes, usageRes] = await Promise.all([
      getEntities("users", 10000),
      getEntities("projects", 10000),
      getEntities("apikeys", 10000),
      getEntities("usagerecords", 10000),
    ]);

    const users = usersRes.data;
    const usage = usageRes.data;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalUsers = usersRes.total;
    const totalProjects = projectsRes.total;
    const totalKeys = keysRes.total;
    const totalRequests = usageRes.total;

    const newUsersToday = users.filter(
      (u: any) => new Date(u.createdAt) >= todayStart
    ).length;

    const avgLatency =
      usage.length > 0
        ? Math.round(
            usage.reduce((s: number, u: any) => s + (u.value || 0), 0) /
              usage.length
          )
        : 0;

    const recentUsage = usage.filter(
      (u: any) => new Date(u.createdAt) >= sevenDaysAgo
    );
    const activeUsers = new Set(recentUsage.map((u: any) => u.category)).size;

    const endpointMap: Record<string, number> = {};
    for (const u of usage) {
      const ep = u.category || "unknown";
      endpointMap[ep] = (endpointMap[ep] || 0) + 1;
    }
    const topEndpoints = Object.entries(endpointMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    const hourlyMap: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourlyMap[h] = 0;
    for (const u of recentUsage) {
      hourlyMap[new Date(u.createdAt).getHours()]++;
    }
    const hourlyDistribution = Object.entries(hourlyMap).map(
      ([hour, count]) => ({ hour: parseInt(hour), count })
    );

    const chartMap: Record<string, { requests: number; users: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      chartMap[d.toISOString().split("T")[0]] = { requests: 0, users: 0 };
    }
    for (const u of usage) {
      const date = new Date(u.createdAt).toISOString().split("T")[0];
      if (chartMap[date]) chartMap[date].requests++;
    }
    for (const u of users) {
      const date = new Date(u.createdAt).toISOString().split("T")[0];
      if (chartMap[date]) chartMap[date].users++;
    }
    const chart = Object.entries(chartMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));

    const recentUsage30 = usage.filter(
      (u: any) => new Date(u.createdAt) >= thirtyDaysAgo
    );
    const successCount = recentUsage30.filter(
      (u: any) => u.value >= 0 && u.value < 400
    ).length;
    const uptime =
      recentUsage30.length > 0
        ? Math.round((successCount / recentUsage30.length) * 10000) / 100
        : 100;

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalKeys,
      totalRequests,
      activeUsers,
      newUsersToday,
      avgLatency,
      uptime,
      chart,
      topEndpoints,
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
