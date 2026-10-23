	"use client";

import { CreditCard } from "lucide-react";

export function BillingCard() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 border-cyber-cyan/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyber-white/5 border border-cyber-white/10 px-2.5 py-0.5 text-xs font-mono font-bold text-cyber-white/40">
                CURRENT PLAN: FREE
              </span>
            </div>
            <h3 className="text-lg font-bold text-cyber-white">
              No billing integration configured
            </h3>
            <p className="text-xs text-cyber-white/40 font-mono">
              Stripe billing portal is not yet connected to this workspace.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 font-mono text-xs pt-2">
          <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 space-y-2">
            <span className="text-cyber-white/40 text-[10px]">API PROJECTS</span>
            <p className="text-lg font-bold text-cyber-white/30">—</p>
          </div>
          <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 space-y-2">
            <span className="text-cyber-white/40 text-[10px]">MONTHLY API RUNS</span>
            <p className="text-lg font-bold text-cyber-white/30">—</p>
          </div>
          <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 space-y-2">
            <span className="text-cyber-white/40 text-[10px]">TEAM SEATS</span>
            <p className="text-lg font-bold text-cyber-white/30">—</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-white/10 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white font-mono flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-cyber-purple" />
            Billing Invoice Receipts
          </h4>
        </div>
        <div className="py-8 text-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No invoices available. Billing integration is not yet configured.
          </p>
        </div>
      </div>
    </div>
  );
}
