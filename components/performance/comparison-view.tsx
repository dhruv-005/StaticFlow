"use client";

import { usePerformanceStore } from "@/stores/performance-store";
import { GitCompare, TrendingDown, TrendingUp, CheckCircle2 } from "lucide-react";

export function ComparisonView() {
  const { tests } = usePerformanceStore();

  const baseline = tests[0] || {
    avgResponseMs: 64.2,
    p95ResponseMs: 110.5,
    throughputReqSec: 850,
    errorRatePercent: 0.04,
  };

  const current = tests[1] || {
    avgResponseMs: 38.4,
    p95ResponseMs: 56.2,
    throughputReqSec: 1420,
    errorRatePercent: 0.0,
  };

  const latencyDiff = ((baseline.avgResponseMs - current.avgResponseMs) / baseline.avgResponseMs) * 100;
  const throughputDiff = ((current.throughputReqSec - baseline.throughputReqSec) / baseline.throughputReqSec) * 100;

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-cyber-cyan" />
          <h3 className="font-bold text-cyber-white">
            Benchmark Comparison (Baseline vs Latest Optimization)
          </h3>
        </div>
        <span className="flex items-center gap-1 text-xs font-mono text-cyber-green">
          <CheckCircle2 className="h-3.5 w-3.5" /> +{latencyDiff.toFixed(0)}% Overall Gain
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Latency Comparison Card */}
        <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2">
          <span className="text-xs font-mono text-cyber-white/40">Response Time Comparison</span>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-cyber-white/30">Previous</p>
              <p className="text-lg font-mono text-cyber-white/60">{baseline.avgResponseMs}ms</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-cyber-cyan font-bold">Optimized</p>
              <p className="text-2xl font-mono font-black text-cyber-cyan">{current.avgResponseMs}ms</p>
            </div>
          </div>
          <p className="flex items-center gap-1 text-[11px] font-mono text-cyber-green pt-1 border-t border-cyber-white/5">
            <TrendingDown className="h-3.5 w-3.5" /> {latencyDiff.toFixed(1)}% Latency Drop
          </p>
        </div>

        {/* Throughput Comparison Card */}
        <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2">
          <span className="text-xs font-mono text-cyber-white/40">Throughput Capacity</span>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-cyber-white/30">Previous</p>
              <p className="text-lg font-mono text-cyber-white/60">{baseline.throughputReqSec} r/s</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-cyber-purple font-bold">Optimized</p>
              <p className="text-2xl font-mono font-black text-cyber-purple">{current.throughputReqSec} r/s</p>
            </div>
          </div>
          <p className="flex items-center gap-1 text-[11px] font-mono text-cyber-green pt-1 border-t border-cyber-white/5">
            <TrendingUp className="h-3.5 w-3.5" /> +{throughputDiff.toFixed(1)}% Capacity Gain
          </p>
        </div>

        {/* Reliability / Error Rate Card */}
        <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2">
          <span className="text-xs font-mono text-cyber-white/40">Error Stability</span>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-cyber-white/30">Previous</p>
              <p className="text-lg font-mono text-cyber-white/60">{baseline.errorRatePercent}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-cyber-green font-bold">Optimized</p>
              <p className="text-2xl font-mono font-black text-cyber-green">{current.errorRatePercent}%</p>
            </div>
          </div>
          <p className="flex items-center gap-1 text-[11px] font-mono text-cyber-green pt-1 border-t border-cyber-white/5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Zero Dropped Packets
          </p>
        </div>
      </div>
    </div>
  );
}
