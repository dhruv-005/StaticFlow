"use client";

import { useState } from "react";
import { Globe, Plus, CheckCircle2, Copy, Check } from "lucide-react";

export function DomainSetup() {
  const [domain, setDomain] = useState("api.mybrand.dev");
  const [copied, setCopied] = useState(false);

  const copyCname = () => {
    navigator.clipboard.writeText("cname.staticflow.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Globe className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Custom Domain Routing &amp; CNAME</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Map your custom hostname with automated Anycast global routing</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="api.yourdomain.com"
          className="flex-1 rounded-xl border border-cyber-white/10 bg-cyber-white/[0.03] px-4 py-2.5 text-sm font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
        />
        <button className="neon-button flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Plus className="h-4 w-4" /> Add Domain
        </button>
      </div>

      <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white font-mono">
            Required DNS Records (at your registrar)
          </h4>
          <span className="flex items-center gap-1 text-[11px] font-mono text-cyber-green">
            <CheckCircle2 className="h-3.5 w-3.5" /> DNS Verified
          </span>
        </div>

        <div className="divide-y divide-cyber-white/5 rounded-lg border border-cyber-white/10 bg-black/60 font-mono text-xs">
          <div className="grid grid-cols-4 p-3 text-cyber-white/40 text-[11px]">
            <span>TYPE</span>
            <span>NAME</span>
            <span>TARGET / VALUE</span>
            <span className="text-right">ACTION</span>
          </div>
          <div className="grid grid-cols-4 p-3 items-center text-cyber-white">
            <span className="text-cyber-cyan font-bold">CNAME</span>
            <span>api</span>
            <span className="text-cyber-white/80">cname.staticflow.dev</span>
            <div className="flex justify-end">
              <button
                onClick={copyCname}
                className="flex items-center gap-1 rounded bg-cyber-white/5 border border-cyber-white/10 px-2 py-1 text-[10px] text-cyber-white/60 hover:text-cyber-white"
              >
                {copied ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
