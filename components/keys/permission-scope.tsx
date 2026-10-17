"use client";

import { Sliders, ShieldCheck, Lock } from "lucide-react";

export function PermissionScope() {
  const scopes = [
    { scope: "read:users", desc: "Allows retrieval of user profiles and authentication status", level: "Read" },
    { scope: "write:users", desc: "Allows creation and modification of user accounts", level: "Write" },
    { scope: "read:orders", desc: "Allows querying checkout orders and line items", level: "Read" },
    { scope: "write:orders", desc: "Allows order state transitions and refund triggers", level: "Write" },
    { scope: "admin:all", desc: "Full administrative access across all endpoints", level: "Admin" },
  ];

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="h-5 w-5 text-cyber-purple" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Role-Based Scope Definitions</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Fine-grained token access controls enforced at the gateway</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-cyber-white/5 rounded-xl border border-cyber-white/10 bg-cyber-space/80 font-mono text-xs">
        {scopes.map((s) => (
          <div key={s.scope} className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="font-bold text-cyber-purple text-sm">{s.scope}</span>
              <p className="text-[11px] text-cyber-white/50">{s.desc}</p>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                s.level === "Admin"
                  ? "bg-cyber-red/10 border border-cyber-red/30 text-cyber-red"
                  : s.level === "Write"
                  ? "bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow"
                  : "bg-cyber-green/10 border border-cyber-green/30 text-cyber-green"
              }`}
            >
              {s.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
