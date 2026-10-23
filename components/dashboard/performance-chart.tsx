"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface ChartPoint {
  label: string;
  calls: number;
}

export function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/overview")
      .then((r) => r.json())
      .then((data) => setChartData(data.chartData || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxCalls = Math.max(...chartData.map((d) => d.calls), 1);
  const totalWeek = chartData.reduce((s, d) => s + d.calls, 0);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyber-green" />
          <h3 className="text-sm font-bold text-cyber-white font-mono">
            7-Day API Traffic
          </h3>
        </div>
        <span className="text-xs font-mono text-cyber-white/40">
          {totalWeek.toLocaleString()} calls this week
        </span>
      </div>

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-cyber-white/5" />
      ) : chartData.length === 0 || totalWeek === 0 ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No API traffic recorded yet.
          </p>
        </div>
      ) : (
        <div className="flex items-end gap-2 h-32">
          {chartData.map((d) => (
            <div
              key={d.label}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-[9px] font-mono text-cyber-white/40">
                {d.calls}
              </span>
              <div
                className="w-full rounded-t-md bg-cyber-cyan/60 transition-all"
                style={{
                  height: `${Math.max((d.calls / maxCalls) * 100, 4)}%`,
                  minHeight: "4px",
                }}
              />
              <span className="text-[9px] font-mono text-cyber-white/30">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
