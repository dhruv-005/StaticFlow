"use client";

import { Clock, TrendingUp } from "lucide-react";

export function ResponseTime({
  avg,
  p95,
  p99,
}: {
  avg: number;
  p95: number;
  p99: number;
}) {
  const isHealthy = avg < 100;

  return (
    <div className="glass-card p-4 space-y-2 border-cyber-cyan/20">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-white/40">
          Average Latency
        </span>
        <Clock className="h-4 w-4 text-cyber-cyan" />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-cyber-cyan font-mono">
          {avg.toFixed(1)}
        </span>
        <span className="text-xs font-mono text-cyber-white/40">ms</span>
      </div>

      <div className="flex items-center justify-between border-t border-cyber-white/5 pt-2 text-[10px] font-mono text-cyber-white/50">
        <span>P95: {p95.toFixed(1)}ms</span>
        <span>P99: {p99.toFixed(1)}ms</span>
        <span className={isHealthy ? "text-cyber-green" : "text-cyber-yellow"}>
          {isHealthy ? "Optimal" : "High"}
        </span>
      </div>
    </div>
  );
}
