"use client";

import { Key, Terminal } from "lucide-react";

export function ApiSettings() {
  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Key className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">
              Personal Access Tokens (PATs)
            </h3>
            <p className="text-xs text-cyber-white/40 font-mono">
              Authenticate local terminal and CLI tools
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-cyber-white/10 bg-black/80 p-4 space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyber-cyan">
          <Terminal className="h-4 w-4" />
          <span>CLI authentication is not yet available.</span>
        </div>
        <p className="text-cyber-white/40">
          Personal Access Tokens require a backend PAT model. Use API Keys
          instead for programmatic access.
        </p>
      </div>

      <div className="py-4 text-center">
        <p className="text-xs text-cyber-white/30 font-mono">
          No personal access tokens configured. This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
