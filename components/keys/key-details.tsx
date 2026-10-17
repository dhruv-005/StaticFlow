"use client";

import { ApiKey } from "@/types/api-key";
import { ShieldCheck, Lock, Globe, Clock, BarChart3 } from "lucide-react";

export function KeyDetails({ apiKey }: { apiKey: ApiKey }) {
  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-cyber-white">{apiKey.keyName}</h3>
          <p className="text-xs text-cyber-white/40 font-mono">Token ID: {apiKey.id}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2">
          <span className="text-xs font-mono text-cyber-white/40 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-cyber-purple" /> Granted Scopes
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {apiKey.permissions.map((p) => (
              <span key={p} className="rounded bg-cyber-purple/10 border border-cyber-purple/30 px-2 py-0.5 text-[10px] font-mono text-cyber-purple">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2">
          <span className="text-xs font-mono text-cyber-white/40 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-cyber-cyan" /> Subnet Firewall
          </span>
          <p className="text-xs font-mono text-cyber-white/80">
            {apiKey.ipWhitelist.length > 0 ? apiKey.ipWhitelist.join(", ") : "0.0.0.0/0 (Global Access)"}
          </p>
        </div>
      </div>
    </div>
  );
}
