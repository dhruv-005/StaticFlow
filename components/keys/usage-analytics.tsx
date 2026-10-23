"use client";

import { BarChart3 } from "lucide-react";

export function UsageAnalytics() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <BarChart3 className="h-4 w-4 text-cyber-cyan" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Per-Key Usage Analytics
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          Per-key usage breakdown is not yet available.
        </p>
        <p className="text-[10px] text-cyber-white/20 font-mono text-center">
          Usage records are not linked to individual keys yet.
        </p>
      </div>
    </div>
  );
}
