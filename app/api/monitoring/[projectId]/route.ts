import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: { id: params.projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Generate simulated monitoring data
    // In production: pull from UptimeRobot / Grafana / Prometheus
    const now = Date.now();
    const metrics24h = Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
      avgResponseTime: Math.floor(Math.random() * 60) + 25,
      requestCount: Math.floor(Math.random() * 500) + 50,
      errorCount: Math.floor(Math.random() * 5),
    }));

    const totalRequests = metrics24h.reduce((s, m) => s + m.requestCount, 0);
    const totalErrors = metrics24h.reduce((s, m) => s + m.errorCount, 0);

    return NextResponse.json({
      projectId: params.projectId,
      uptimePercentage: 99.97,
      avgResponseTimeMs: Math.floor(
        metrics24h.reduce((s, m) => s + m.avgResponseTime, 0) / 24
      ),
      totalRequests,
      errorRate: parseFloat(((totalErrors / totalRequests) * 100).toFixed(2)),
      metrics24h,
      status: "operational",
    });
  } catch (error) {
    console.error("[API] GET /monitoring/:projectId error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
