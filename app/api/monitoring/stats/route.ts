import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEntities } from "@/lib/render-client";

function deriveStatus(value: number): number {
  if (value > 90) return 500;
  if (value > 70) return 404;
  if (value > 50) return 301;
  return 200;
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const res = await getEntities("usagerecords", 10000);
    const records = res.data.map((r: any) => {
      const created = new Date(r.createdAt);
      const latency = Math.round(r.value || 0);
      const status = deriveStatus(r.value || 0);
      return {
        id: r.id,
        endpoint: r.category || "/api/unknown",
        method: (r.name || "GET").toUpperCase(),
        status,
        latency,
        createdAt: created,
        hourKey: `${String(created.getHours()).padStart(2, "0")}:00`,
      };
    });

    const dayAgo = new Date();
    dayAgo.setHours(dayAgo.getHours() - 24);
    const recent = records.filter((r: any) => r.createdAt >= dayAgo);

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

    for (const r of recent) {
      if (volumeMap[r.hourKey] !== undefined) volumeMap[r.hourKey]++;

      const lKeys = Object.keys(latencyMap);
      const closest = lKeys.reduce((prev, curr) => {
        const pH = parseInt(prev);
        const cH = parseInt(curr);
        return Math.abs(cH - r.createdAt.getHours()) <
          Math.abs(pH - r.createdAt.getHours())
          ? curr
          : prev;
      });
      latencyMap[closest]?.push(r.latency);

      const sg = `${Math.floor(r.status / 100)}xx`;
      if (errorCounts[sg] !== undefined) errorCounts[sg]++;
    }

    const requestVolume = Object.entries(volumeMap).map(
      ([label, count]) => ({ label, count })
    );

    const responseTime = Object.entries(latencyMap).map(
      ([label, lats]) => {
        if (!lats.length) return { label, p50: 0, p95: 0, p99: 0 };
        const s = [...lats].sort((a, b) => a - b);
        return {
          label,
          p50: Math.round(s[Math.floor(s.length * 0.5)] || 0),
          p95: Math.round(s[Math.floor(s.length * 0.95)] || 0),
          p99: Math.round(s[Math.floor(s.length * 0.99)] || 0),
        };
      }
    );

    const errorRates = Object.entries(errorCounts).map(
      ([status, count]) => ({ status, count })
    );

    const logs = records
      .sort(
        (a: any, b: any) =>
          b.createdAt.getTime() - a.createdAt.getTime()
      )
      .slice(0, 50)
      .map((r: any) => ({
        id: r.id,
        endpoint: r.endpoint,
        method: r.method,
        status: r.status,
        latency: r.latency,
        createdAt: r.createdAt.toISOString(),
      }));

    return NextResponse.json({
      totalRequests: recent.length,
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
