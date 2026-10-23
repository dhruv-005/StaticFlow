"use client";

import { Radio } from "lucide-react";

export function StatusPage() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <Radio className="h-4 w-4 text-cyber-green" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Service Status
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          Public status page is not yet configured.
        </p>
        <p className="text-[10px] text-cyber-white/20 font-mono text-center">
          Requires a backend health check system.
        </p>
      </div>
    </div>
  );
}
