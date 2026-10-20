"use client";

import { CheckCircle2, ShieldCheck, Clock, AlertCircle } from "lucide-react";

export function UptimeTracker() {
  // 60-day historical status slots
  const days = Array.from({ length: 60 }, (_, i) => {
    const isDegraded = i === 42;
    const isDown = i === 12;
    return {
      day: i + 1,
      status: isDown ? "down" : isDegraded ? "degraded" : "operational",
      uptime: isDown ? 94.2 : isDegraded ? 98.6 : 100,
      date: new Date(Date.now() - (59 - i) * 86400000).toLocaleDateString(),
    };
  });

  return (
    <div className="glass-card p-5 space-y-4 border-cyber-green/20">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-cyber-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-green/10 border border-cyber-green/30">
            <ShieldCheck className="h-4 w-4 text-cyber-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyber-white">System Availability &amp; SLA</h3>
            <p className="text-[11px] font-mono text-cyber-white/40">Continuous Heartbeat Monitor (60s Interval)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-[10px] uppercase font-mono text-cyber-white/40">60-Day Average</p>
            <p className="text-lg font-mono font-black text-cyber-green">99.985%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono text-cyber-white/40">Current Status</p>
            <span className="inline-flex items-center gap-1 rounded bg-cyber-green/10 px-2 py-0.5 text-xs font-mono font-bold text-cyber-green">
              <CheckCircle2 className="h-3 w-3" /> Operational
            </span>
          </div>
        </div>
      </div>

      {/* 60-Bar Visual Grid */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 h-9">
          {days.map((d) => (
            <div
              key={d.day}
              className="group relative flex-1 h-full rounded-[2px] transition-all cursor-pointer hover:scale-y-125"
              style={{
                backgroundColor:
                  d.status === "operational"
                    ? "#00FF88"
                    : d.status === "degraded"
                    ? "#FFD700"
                    : "#FF3366",
                opacity: d.status === "operational" ? 0.75 : 1,
              }}
            >
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center rounded-lg border border-cyber-white/10 bg-cyber-navy/95 px-2.5 py-1 text-[10px] font-mono text-cyber-white shadow-xl z-30 whitespace-nowrap">
                <span>{d.date}</span>
                <span
                  className={
                    d.status === "operational"
                      ? "text-cyber-green"
                      : d.status === "degraded"
                      ? "text-cyber-yellow"
                      : "text-cyber-red"
                  }
                >
                  {d.uptime}% Uptime ({d.status})
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-[11px] font-mono text-cyber-white/40">
          <span>60 Days Ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
