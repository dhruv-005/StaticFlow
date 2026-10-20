"use client";

import { Lock, CheckCircle2 } from "lucide-react";

export function SslStatus({ domain: _domain }: { domain?: string }) {
  return (
    <div className="glass-card p-4 space-y-2 border-cyber-green/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-cyber-green" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white font-mono">
            Automated SSL / TLS 1.3
          </h4>
        </div>
        <span className="flex items-center gap-1 rounded bg-cyber-green/10 border border-cyber-green/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyber-green">
          <CheckCircle2 className="h-3 w-3" /> ACTIVE
        </span>
      </div>

      <p className="text-[11px] font-mono text-cyber-white/50 leading-relaxed">
        Let&apos;s Encrypt certificate auto-renews every 60 days with Strict-Transport-Security (HSTS).
      </p>
    </div>
  );
}
