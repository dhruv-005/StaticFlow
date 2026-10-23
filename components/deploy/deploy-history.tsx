"use client";

import { Rocket } from "lucide-react";

export function DeployHistory() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <Rocket className="h-4 w-4 text-cyber-green" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Deployment History
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center py-10 space-y-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyber-white/10 bg-cyber-white/5">
          <Rocket className="h-6 w-6 text-cyber-white/20" />
        </div>
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          No deployments recorded.
        </p>
        <p className="text-[10px] text-cyber-white/20 font-mono text-center">
          Cloud deployment tracking coming soon.
        </p>
      </div>
    </div>
  );
}
