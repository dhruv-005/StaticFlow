"use client";

import { Zap, Activity } from "lucide-react";

export function ThroughputGraph({ throughput }: { throughput: number }) {
  return (
    <div className="glass-card p-4 space-y-2 border-cyber-purple/20">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-white/40">
          Throughput Rate
        </span>
        <Zap className="h-4 w-4 text-cyber-purple" />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-cyber-purple font-mono">
          {throughput.toLocaleString()}
        </span>
        <span className="text-xs font-mono text-cyber-white/40">req/sec</span>
      </div>

      <div className="flex items-center justify-between border-t border-cyber-white/5 pt-2 text-[10px] font-mono text-cyber-white/50">
        <span className="flex items-center gap-1 text-cyber-green">
          <Activity className="h-3 w-3" /> Non-blocking IO
        </span>
        <span>HTTP/2 Pipeline</span>
      </div>
    </div>
  );
}
