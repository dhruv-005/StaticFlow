import { NextResponse } from "next/server";
import { getEntities } from "@/lib/render-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [projectsRes, usersRes, usageRes, keysRes] = await Promise.all([
      getEntities("projects", 1),
      getEntities("users", 1),
      getEntities("usagerecords", 10000),
      getEntities("apikeys", 1),
    ]);

    const totalProjects = projectsRes.total;
    const totalUsers = usersRes.total;
    const totalApiCalls = usageRes.total;
    const totalKeys = keysRes.total;

    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );
    const recentUsage = usageRes.data.filter(
      (u: any) => new Date(u.createdAt) >= thirtyDaysAgo
    );

    const successCount = recentUsage.filter(
      (u: any) => u.value >= 0 && u.value < 400
    ).length;
    const uptime =
      recentUsage.length > 0
        ? Math.round((successCount / recentUsage.length) * 10000) / 100
        : 99.9;

    return NextResponse.json({
      totalProjects,
      totalUsers,
      totalApiCalls,
      totalKeys,
      uptime,
    });
  } catch (err) {
    console.error("Public stats error:", err);
    return NextResponse.json({
      totalProjects: 0,
      totalUsers: 0,
      totalApiCalls: 0,
      totalKeys: 0,
      uptime: 99.9,
    });
  }
}
