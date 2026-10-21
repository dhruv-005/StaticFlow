import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalProjects,
      totalKeys,
      totalAuditLogs,
      totalCalls,
      activeUserIds,
      recentUsers,
      recentLogs,
      usageByDay,
      usersByRole,
    ] = await Promise.all([
      db.user.count(),
      db.project.count(),
      db.apiKey.count(),
      db.auditLog.count(),
      db.usageRecord.count(),
      db.usageRecord.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { userId: true },
        distinct: ["userId"],
      }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { projects: true, apiKeys: true } },
        },
      }),
      db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      db.usageRecord.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      db.user.groupBy({ by: ["role"], _count: true }),
    ]);

    const chartData: { date: string; calls: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const count = usageByDay.filter(
        (r) => r.createdAt.toISOString().split("T")[0] === dateStr
      ).length;
      chartData.push({ date: dateStr, calls: count });
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProjects,
        totalKeys,
        totalCalls,
        totalAuditLogs,
        activeUsers: activeUserIds.length,
        roles: usersByRole.reduce(
          (a: any, r: any) => ({ ...a, [r.role]: r._count }),
          {}
        ),
      },
      chartData,
      recentUsers,
      recentLogs: recentLogs.map((l: any) => ({
        id: l.id,
        action: l.action,
        details: l.details,
        userName: l.user?.name || l.user?.email || "System",
        createdAt: l.createdAt,
        ipAddress: l.ipAddress,
      })),
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN")
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
