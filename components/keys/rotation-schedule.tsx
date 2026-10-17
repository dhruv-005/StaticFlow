"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function RotationSchedule() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationDays, setRotationDays] = useState(60);
  const [gracePeriodHours, setGracePeriodHours] = useState(24);

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <RefreshCw className="h-5 w-5 text-cyber-purple" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Automated Key Rotation Policies</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Zero-downtime key rollover with dual-active grace periods</p>
          </div>
        </div>
      </div>

      {/* Main Switch */}
      <div className="flex items-center justify-between rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4">
        <div>
          <p className="text-sm font-bold text-cyber-white">Enable Automated Token Re-issuance</p>
          <p className="text-xs text-cyber-white/40">Continuously generates new secrets and retires aged keys.</p>
        </div>
        <Switch checked={autoRotate} onCheckedChange={setAutoRotate} />
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2 font-mono text-xs">
        <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2">
          <span className="text-cyber-white/40 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cyber-cyan" /> Rotation Frequency
          </span>
          <select
            value={rotationDays}
            onChange={(e) => setRotationDays(Number(e.target.value))}
            className="w-full rounded-lg border border-cyber-white/10 bg-cyber-navy p-2 text-xs text-cyber-white outline-none"
          >
            <option value={30}>Every 30 Days (Strict SOC 2)</option>
            <option value={60}>Every 60 Days (Standard)</option>
            <option value={90}>Every 90 Days (PCI-DSS)</option>
          </select>
        </div>

        <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-2">
          <span className="text-cyber-white/40 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-cyber-green" /> Dual-Active Grace Period
          </span>
          <select
            value={gracePeriodHours}
            onChange={(e) => setGracePeriodHours(Number(e.target.value))}
            className="w-full rounded-lg border border-cyber-white/10 bg-cyber-navy p-2 text-xs text-cyber-white outline-none"
          >
            <option value={12}>12 Hours</option>
            <option value={24}>24 Hours (Recommended)</option>
            <option value={48}>48 Hours</option>
          </select>
        </div>
      </div>
    </div>
  );
}
