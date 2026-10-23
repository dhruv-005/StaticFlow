"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBucket {
  status: string;
  count: number;
}

export function ErrorRateChart() {
  const [data, setData] = useState<ErrorBucket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monitoring/stats")
      .then((r) => r.json())
      .then((d) => setData(d.errorRates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = data.reduce((s, d) => s + d.count, 0);
  const colors: Record<string, string> = {
    "2xx": "bg-cyber-green",
    "3xx": "bg-cyber-cyan",
    "4xx": "bg-cyber-yellow",
    "5xx": "bg-cyber-red",
  };
  const textColors: Record<string, string> = {
    "2xx": "text-cyber-green",
    "3xx": "text-cyber-cyan",
    "4xx": "text-cyber-yellow",
    "5xx": "text-cyber-red",
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <AlertTriangle className="h-4 w-4 text-cyber-yellow" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Status Code Distribution (24h)
        </h3>
      </div>

      {loading ? (
        <div className="h-20 animate-pulse rounded-xl bg-cyber-white/5" />
      ) : total === 0 ? (
        <div className="flex h-20 items-center justify-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No requests in the last 24 hours.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex h-6 rounded-full overflow-hidden bg-cyber-white/5">
            {data.map((d) =>
              d.count > 0 ? (
                <div
                  key={d.status}
                  className={`${colors[d.status] || "bg-cyber-white/20"} transition-all`}
                  style={{ width: `${(d.count / total) * 100}%` }}
                />
              ) : null
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            {data.map((d) => (
              <span key={d.status} className={textColors[d.status] || "text-cyber-white/40"}>
                {d.status}: {d.count.toLocaleString()} (
                {total > 0 ? Math.round((d.count / total) * 100) : 0}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
