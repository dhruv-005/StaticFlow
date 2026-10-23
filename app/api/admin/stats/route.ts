import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [usersRes, projectsRes, keysRes, usageRes, auditRes] =
      await Promise.all([
        getEntities("users", 10000),
        getEntities("projects", 10000),
        getEntities("apikeys", 10000),
        getEntities("usagerecords", 10000),
        getEntities("auditlogs", 10000),
      ]);

    const users = usersRes.data;
    const usage = usageRes.data;
    const audit = auditRes.data;

    const activeUserIds = new Set(
      usage
        .filter((u: any) => new Date(u.createdAt) >= sevenDaysAgo)
        .map((u: any) => u.category)
    );

    const recentUsers = users.slice(0, 10).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email || "",
      role: u.role || "USER",
      createdAt: u.createdAt,
      _count: { projects: 0, apiKeys: 0 },
    }));

    const recentLogs = audit.slice(0, 20).map((l: any) => ({
      id: l.id,
      action: l.name || "UNKNOWN",
      details: l.description || "",
      userName: l.category || "System",
      createdAt: l.createdAt,
      ipAddress: "—",
    }));

    const chartData: { date: string; calls: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const count = usage.filter(
        (u: any) =>
          new Date(u.createdAt).toISOString().split("T")[0] === dateStr
      ).length;
      chartData.push({ date: dateStr, calls: count });
    }

    const roleMap: Record<string, number> = {};
    for (const u of users) {
      const r = (u.role || "USER").toUpperCase();
      roleMap[r] = (roleMap[r] || 0) + 1;
    }

    return NextResponse.json({
      stats: {
        totalUsers: usersRes.total,
        totalProjects: projectsRes.total,
        totalKeys: keysRes.total,
        totalCalls: usageRes.total,
        totalAuditLogs: auditRes.total,
        activeUsers: activeUserIds.size,
        roles: roleMap,
      },
      chartData,
      recentUsers,
      recentLogs,
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
