"use client";

import { Sparkles, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

export function AnomalyDetector() {
  const anomalies = [
    {
      title: "Sudden POST Rate Surge",
      detail: "POST /api/auth/register experienced 400 req/s from single subnet.",
      severity: "warn",
      time: "12m ago",
    },
    {
      title: "Slow Query Latency Spike",
      detail: "GET /api/reports hit 450ms due to unindexed timestamp filter.",
      severity: "info",
      time: "1h ago",
    },
  ];

  return (
    <div className="glass-card p-5 space-y-4 border-cyber-cyan/20">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyber-cyan animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white">
            AI Anomaly Engine
          </h4>
        </div>
        <span className="rounded bg-cyber-cyan/10 border border-cyber-cyan/30 px-2 py-0.5 text-[10px] font-mono text-cyber-cyan">
          Active Watch
        </span>
      </div>

      <div className="space-y-2.5">
        {anomalies.map((a, i) => (
          <div
            key={i}
            className="rounded-lg border border-cyber-white/5 bg-cyber-white/[0.02] p-3 space-y-1 hover:border-cyber-cyan/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyber-white flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-cyber-yellow" />
                {a.title}
              </span>
              <span className="text-[10px] font-mono text-cyber-white/30">{a.time}</span>
            </div>
            <p className="text-[11px] text-cyber-white/50 leading-relaxed">{a.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
