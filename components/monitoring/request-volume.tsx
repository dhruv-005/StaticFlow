"use client";

import { BarChart3, TrendingUp, HardDrive } from "lucide-react";

export function RequestVolume() {
  const bars = [32, 45, 28, 55, 68, 85, 92, 110, 98, 75, 62, 88, 120, 140, 135, 115, 94, 78, 65, 82, 95, 108, 112, 90];
  const max = Math.max(...bars);

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyber-purple" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white">
            Hourly Request Traffic &amp; Egress
          </h4>
        </div>
        <span className="flex items-center gap-1 text-xs font-mono text-cyber-green">
          <TrendingUp className="h-3.5 w-3.5" /> +14.2% Today
        </span>
      </div>

      {/* Bar graph */}
      <div className="flex items-end gap-1.5 h-32 pt-4">
        {bars.map((val, idx) => {
          const heightPercent = (val / max) * 100;
          return (
            <div key={idx} className="group relative flex-1 flex flex-col items-center h-full justify-end">
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full rounded-t-[2px] bg-gradient-to-t from-cyber-purple/20 to-cyber-purple/80 hover:to-cyber-cyan transition-all"
              />
              {/* Tooltip */}
              <div className="absolute -top-8 hidden group-hover:block rounded bg-cyber-navy border border-cyber-white/10 px-1.5 py-0.5 text-[9px] font-mono text-cyber-white z-20 whitespace-nowrap">
                {val * 100} reqs
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-2 border-t border-cyber-white/5 pt-3 text-xs font-mono">
        <div>
          <p className="text-cyber-white/40">Total Requests</p>
          <p className="text-base font-bold text-cyber-white">2.41M / day</p>
        </div>
        <div>
          <p className="text-cyber-white/40">Peak Egress</p>
          <p className="text-base font-bold text-cyber-purple">14.8 MB/s</p>
        </div>
        <div>
          <p className="text-cyber-white/40">Bandwidth (24h)</p>
          <p className="text-base font-bold text-cyber-cyan">34.2 GB</p>
        </div>
      </div>
    </div>
  );
}
