"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimePoint {
  label: string;
  p50: number;
  p95: number;
  p99: number;
}

export function ResponseTimeChart() {
  const [data, setData] = useState<TimePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monitoring/stats")
      .then((r) => r.json())
      .then((d) => setData(d.responseTime || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxVal = Math.max(...data.flatMap((d) => [d.p50, d.p95, d.p99]), 1);
  const hasData = data.some((d) => d.p50 > 0);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <Clock className="h-4 w-4 text-cyber-purple" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Response Times (24h)
        </h3>
      </div>

      {loading ? (
        <div className="h-28 animate-pulse rounded-xl bg-cyber-white/5" />
      ) : !hasData ? (
        <div className="flex h-28 items-center justify-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No response time data yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyber-green" /> p50
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyber-yellow" /> p95
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyber-red" /> p99
            </span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {data.map((d) => (
              <div
                key={d.label}
                className="flex flex-1 flex-col items-center gap-0.5"
              >
                <div className="w-full flex items-end gap-px" style={{ height: "100%" }}>
                  <div
                    className="flex-1 rounded-t-sm bg-cyber-green/50"
                    style={{ height: `${Math.max((d.p50 / maxVal) * 100, 2)}%` }}
                  />
                  <div
                    className="flex-1 rounded-t-sm bg-cyber-yellow/50"
                    style={{ height: `${Math.max((d.p95 / maxVal) * 100, 2)}%` }}
                  />
                  <div
                    className="flex-1 rounded-t-sm bg-cyber-red/50"
                    style={{ height: `${Math.max((d.p99 / maxVal) * 100, 2)}%` }}
                  />
                </div>
                <span className="text-[8px] font-mono text-cyber-white/20">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
