"use client";

import { Shield } from "lucide-react";

export function SecurityWidget() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <Shield className="h-4 w-4 text-cyber-purple" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Security Score
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyber-white/10 bg-cyber-white/5">
          <Shield className="h-7 w-7 text-cyber-white/20" />
        </div>
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          No security scans configured yet.
        </p>
        <p className="text-[10px] text-cyber-white/20 font-mono text-center">
          OWASP audit integration coming soon.
        </p>
      </div>
    </div>
  );
}
