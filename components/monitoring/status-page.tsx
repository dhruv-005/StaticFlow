"use client";

import { CheckCircle2, Globe, ExternalLink, ShieldCheck } from "lucide-react";

export function StatusPagePreview() {
  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-cyber-white">Public Status Page Preview</h3>
          <p className="text-xs text-cyber-white/40 font-mono">https://status.yourbrand.staticflow.dev</p>
        </div>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="neon-button flex items-center gap-1.5 !px-3 !py-1.5 text-xs"
        >
          <span>View Public Portal</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Preview Box */}
      <div className="rounded-xl border border-cyber-white/10 bg-black/60 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyber-green animate-pulse" />
            <h4 className="text-sm font-bold text-cyber-green">All Systems Fully Operational</h4>
          </div>
          <span className="text-xs font-mono text-cyber-white/40">Verified by StaticFlow Engine</span>
        </div>

        <div className="divide-y divide-cyber-white/5 rounded-lg border border-cyber-white/10 bg-cyber-space/90">
          {[
            { service: "Core REST API Gateway", status: "Operational", ping: "18ms" },
            { service: "Authentication & JWT Authority", status: "Operational", ping: "22ms" },
            { service: "PostgreSQL Database Cluster", status: "Operational", ping: "4ms" },
            { service: "WebSocket Real-Time Gateway", status: "Operational", ping: "12ms" },
          ].map((item) => (
            <div key={item.service} className="flex items-center justify-between p-3 text-xs font-mono">
              <span className="text-cyber-white/80">{item.service}</span>
              <div className="flex items-center gap-3">
                <span className="text-cyber-white/30">{item.ping}</span>
                <span className="text-cyber-green font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
