"use client";

import { PerformanceTest } from "@/types/performance";
import { Sparkles, Cpu, Database, Server, Check, ArrowRight } from "lucide-react";

export function BottleneckPanel({ test }: { test: PerformanceTest }) {
  const recommendations = [
    {
      icon: Database,
      title: "Add Redis Cache Layer to GET /api/items",
      impact: "Reduce response latency by up to ~65%",
      severity: "high",
    },
    {
      icon: Cpu,
      title: "Index PostgreSQL Column (userId, createdAt)",
      impact: "Eliminates sequential table scans under load",
      severity: "medium",
    },
    {
      icon: Server,
      title: "Enable Gzip / Brotli Payload Compression",
      impact: "Lowers outbound network egress by ~40%",
      severity: "low",
    },
  ];

  return (
    <div className="glass-card p-5 space-y-4 border-cyber-purple/30">
      <div className="flex items-center justify-between border-b border-cyber-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyber-purple animate-pulse" />
          <h4 className="text-sm font-bold text-cyber-white">
            AI Bottleneck Detector &amp; Optimizations
          </h4>
        </div>
        <span className="rounded bg-cyber-purple/10 border border-cyber-purple/30 px-2 py-0.5 text-[10px] font-mono text-cyber-purple uppercase">
          3 Suggestions
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-lg border border-cyber-white/5 bg-cyber-white/[0.02] p-3 hover:border-cyber-purple/30 transition-all"
          >
            <div className="space-y-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-cyber-purple/10 text-cyber-purple">
                <rec.icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-bold text-cyber-white leading-tight">
                {rec.title}
              </p>
              <p className="text-[11px] text-cyber-white/40 leading-normal">
                {rec.impact}
              </p>
            </div>

            <button className="mt-3 flex items-center justify-between text-[11px] font-bold text-cyber-purple hover:text-cyber-cyan transition-colors">
              <span>Apply Fix</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
