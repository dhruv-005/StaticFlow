"use client";

import { ShieldAlert, AlertCircle, CheckCircle2 } from "lucide-react";

export function ErrorRateChart() {
  const codes = [
    { code: "200 OK", count: 84210, percent: 97.4, color: "bg-cyber-green text-cyber-green" },
    { code: "201 Created", count: 1840, percent: 2.1, color: "bg-cyber-cyan text-cyber-cyan" },
    { code: "400 Bad Request", count: 142, percent: 0.2, color: "bg-cyber-yellow text-cyber-yellow" },
    { code: "401 / 403 Auth", count: 88, percent: 0.1, color: "bg-cyber-purple text-cyber-purple" },
    { code: "500 Server Error", count: 6, percent: 0.01, color: "bg-cyber-red text-cyber-red" },
  ];

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-cyber-yellow" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white">
            Status Code Breakdown
          </h4>
        </div>
        <span className="text-[10px] font-mono text-cyber-green">0.01% 5xx Failures</span>
      </div>

      {/* Progress Bar Breakdown */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-cyber-white/5">
        {codes.map((c) => (
          <div
            key={c.code}
            style={{ width: `${c.percent}%` }}
            className={`h-full ${c.color.split(" ")[0]}`}
            title={`${c.code}: ${c.percent}%`}
          />
        ))}
      </div>

      {/* Itemized List */}
      <div className="space-y-2 pt-1">
        {codes.map((c) => (
          <div key={c.code} className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${c.color.split(" ")[0]}`} />
              <span className="text-cyber-white/70">{c.code}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-cyber-white/40">{c.count.toLocaleString()}</span>
              <span className="font-bold text-cyber-white">{c.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
