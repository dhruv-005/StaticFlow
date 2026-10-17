"use client";

import { useState } from "react";
import { Globe, Plus, Trash2, ShieldCheck } from "lucide-react";

export function IpWhitelist() {
  const [ips, setIps] = useState<Array<{ id: string; cidr: string; label: string }>>([
    { id: "1", cidr: "192.168.1.0/24", label: "Office VPN Network" },
    { id: "2", cidr: "54.210.12.99/32", label: "AWS Production Gateway" },
    { id: "3", cidr: "142.250.190.0/24", label: "External Webhook Ingress" },
  ]);

  const [newCidr, setNewCidr] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const addIp = () => {
    if (!newCidr.trim()) return;
    setIps([...ips, { id: Date.now().toString(), cidr: newCidr, label: newLabel || "Custom Rule" }]);
    setNewCidr("");
    setNewLabel("");
  };

  const removeIp = (id: string) => {
    setIps(ips.filter((item) => item.id !== id));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Globe className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">IP &amp; CIDR Firewall Whitelist</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Enforce origin restrictions for all incoming API traffic</p>
          </div>
        </div>
      </div>

      {/* Add New Rule */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newCidr}
          onChange={(e) => setNewCidr(e.target.value)}
          placeholder="CIDR / IP (e.g. 192.168.1.1/32)"
          className="flex-1 rounded-xl border border-cyber-white/10 bg-cyber-white/[0.03] px-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
        />
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Label (e.g. CI Runner)"
          className="flex-1 rounded-xl border border-cyber-white/10 bg-cyber-white/[0.03] px-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
        />
        <button
          onClick={addIp}
          className="neon-button flex items-center justify-center gap-1.5 text-xs font-bold uppercase"
        >
          <Plus className="h-4 w-4" /> Add Rule
        </button>
      </div>

      {/* Rules list */}
      <div className="divide-y divide-cyber-white/5 rounded-xl border border-cyber-white/10 bg-cyber-space/80 font-mono text-xs">
        {ips.map((ip) => (
          <div key={ip.id} className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <span className="font-bold text-cyber-cyan">{ip.cidr}</span>
              <span className="text-cyber-white/40 text-[11px]">({ip.label})</span>
            </div>
            <button
              onClick={() => removeIp(ip.id)}
              className="rounded p-1 text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-red"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
