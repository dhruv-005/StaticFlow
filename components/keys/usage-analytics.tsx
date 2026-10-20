"use client";

import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

export function UsageAnalytics() {
  const keyUsages = [
    { name: "Primary Production Cluster", calls: "1,842,104", quota: "73%", limit: "2.5M/mo", status: "normal" },
    { name: "CI/CD Deployment Runner", calls: "42,800", quota: "4%", limit: "1.0M/mo", status: "normal" },
    { name: "Staging Test Client", calls: "890,200", quota: "89%", limit: "1.0M/mo", status: "warning" },
  ];

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Per-Key Consumption &amp; Quotas</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Monthly request allocations and rate limit monitoring</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {keyUsages.map((k) => (
          <div
            key={k.name}
            className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyber-white font-sans text-sm">{k.name}</span>
              <span className="text-cyber-cyan font-bold">{k.calls} reqs</span>
            </div>

            {/* Quota bar */}
            <div className="h-2 w-full rounded-full bg-cyber-white/5 overflow-hidden">
              <div
                style={{ width: k.quota }}
                className={`h-full ${
                  k.status === "warning" ? "bg-cyber-yellow" : "bg-cyber-cyan"
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-cyber-white/40 pt-1">
              <span>Quota Used: {k.quota}</span>
              <span>Allocated Pool: {k.limit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
