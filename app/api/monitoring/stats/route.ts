import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = session.id;

    const dayAgo = new Date();
    dayAgo.setHours(dayAgo.getHours() - 24);

    const records = await db.usageRecord.findMany({
      where: { userId, createdAt: { gte: dayAgo } },
      orderBy: { createdAt: "asc" },
    });

    const volumeMap: Record<string, number> = {};
    for (let i = 23; i >= 0; i--) {
      const h = new Date();
      h.setHours(h.getHours() - i);
      volumeMap[`${String(h.getHours()).padStart(2, "0")}:00`] = 0;
    }

    const latencyMap: Record<string, number[]> = {};
    for (let i = 11; i >= 0; i--) {
      const h = new Date();
      h.setHours(h.getHours() - i * 2);
      latencyMap[`${String(h.getHours()).padStart(2, "0")}:00`] = [];
    }

    const errorCounts: Record<string, number> = {
      "2xx": 0,
      "3xx": 0,
      "4xx": 0,
      "5xx": 0,
    };

    for (const r of records) {
      const hk = `${String(r.createdAt.getHours()).padStart(2, "0")}:00`;
      if (volumeMap[hk] !== undefined) volumeMap[hk]++;

      const lKeys = Object.keys(latencyMap);
      const closest = lKeys.reduce((prev, curr) => {
        const pH = parseInt(prev);
        const cH = parseInt(curr);
        const rH = r.createdAt.getHours();
        return Math.abs(cH - rH) < Math.abs(pH - rH) ? curr : prev;
      });
      latencyMap[closest]?.push(r.latency);

      const sg = `${Math.floor(r.status / 100)}xx`;
      if (errorCounts[sg] !== undefined) errorCounts[sg]++;
    }

    const requestVolume = Object.entries(volumeMap).map(([label, count]) => ({
      label,
      count,
    }));

    const responseTime = Object.entries(latencyMap).map(([label, lats]) => {
      if (!lats.length) return { label, p50: 0, p95: 0, p99: 0 };
      const s = [...lats].sort((a, b) => a - b);
      return {
        label,
        p50: Math.round(s[Math.floor(s.length * 0.5)] || 0),
        p95: Math.round(s[Math.floor(s.length * 0.95)] || 0),
        p99: Math.round(s[Math.floor(s.length * 0.99)] || 0),
      };
    });

    const errorRates = Object.entries(errorCounts).map(([status, count]) => ({
      status,
      count,
    }));

    const logs = await db.usageRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        endpoint: true,
        method: true,
        status: true,
        latency: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      totalRequests: records.length,
      requestVolume,
      responseTime,
      errorRates,
      logs,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
