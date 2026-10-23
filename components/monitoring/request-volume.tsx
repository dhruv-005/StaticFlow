"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

interface VolumePoint {
  label: string;
  count: number;
}

export function RequestVolume() {
  const [data, setData] = useState<VolumePoint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monitoring/stats")
      .then((r) => r.json())
      .then((d) => {
        setData(d.requestVolume || []);
        setTotal(d.totalRequests || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyber-cyan" />
          <h3 className="text-sm font-bold text-cyber-white font-mono">
            Request Volume (24h)
          </h3>
        </div>
        <span className="text-xs font-mono text-cyber-white/40">
          {total.toLocaleString()} total
        </span>
      </div>

      {loading ? (
        <div className="h-28 animate-pulse rounded-xl bg-cyber-white/5" />
      ) : total === 0 ? (
        <div className="flex h-28 items-center justify-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No requests in the last 24 hours.
          </p>
        </div>
      ) : (
        <div className="flex items-end gap-1 h-28">
          {data.map((d) => (
            <div
              key={d.label}
              className="flex flex-1 flex-col items-center gap-0.5"
            >
              <div
                className="w-full rounded-t-sm bg-cyber-cyan/50"
                style={{
                  height: `${Math.max((d.count / max) * 100, 2)}%`,
                  minHeight: "2px",
                }}
              />
              <span className="text-[7px] font-mono text-cyber-white/20 rotate-45 origin-top-left">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
