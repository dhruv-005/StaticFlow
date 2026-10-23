"use client";

import { Globe } from "lucide-react";

export function GeoLatencyMap() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <Globe className="h-4 w-4 text-cyber-cyan" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Global Edge Latency
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          Geo-distributed latency tracking is not yet configured.
        </p>
        <p className="text-[10px] text-cyber-white/20 font-mono text-center">
          Requires multi-region edge deployment data.
        </p>
      </div>
    </div>
  );
}
