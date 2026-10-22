import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalProjects, totalUsers, totalApiCalls, totalKeys] =
      await Promise.all([
        prisma.project.count(),
        prisma.user.count(),
        prisma.usageRecord.count(),
        prisma.apiKey.count(),
      ]);

    /* Uptime = success rate (2xx/3xx) in last 30 days */
    const statusRows = await prisma.$queryRaw<
      { status: number; count: bigint }[]
    >`
      SELECT status, COUNT(*) as count
      FROM "UsageRecord"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY status
    `;
    const totalRecent = statusRows.reduce(
      (s, r) => s + Number(r.count),
      0
    );
    const successCount = statusRows
      .filter((r) => r.status >= 200 && r.status < 400)
      .reduce((s, r) => s + Number(r.count), 0);
    const uptime =
      totalRecent > 0
        ? Math.round((successCount / totalRecent) * 10000) / 100
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
