"use client";

import { CreditCard, Download } from "lucide-react";

export function BillingCard() {
  const invoices = [
    { id: "INV-2024-009", date: "Oct 01, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-2024-008", date: "Sep 01, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-2024-007", date: "Aug 01, 2024", amount: "$29.00", status: "Paid" },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 border-cyber-cyan/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyber-cyan/10 border border-cyber-cyan/30 px-2.5 py-0.5 text-xs font-mono font-bold text-cyber-cyan">
                CURRENT PLAN: PRO DEVELOPER
              </span>
              <span className="text-xs font-mono text-cyber-white/40">$29 / month</span>
            </div>
            <h3 className="text-lg font-bold text-cyber-white">Unlimited API Scaffolding &amp; Deep OWASP Audits</h3>
          </div>

          <button className="neon-button text-xs uppercase font-bold tracking-wider">
            Manage via Stripe Portal
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 font-mono text-xs pt-2">
          <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 space-y-2">
            <span className="text-cyber-white/40 text-[10px]">API PROJECTS</span>
            <p className="text-lg font-bold text-cyber-white">12 / Unlimited</p>
            <div className="h-1.5 w-full rounded-full bg-cyber-cyan" />
          </div>

          <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 space-y-2">
            <span className="text-cyber-white/40 text-[10px]">MONTHLY API RUNS</span>
            <p className="text-lg font-bold text-cyber-cyan">18,400 / 100,000</p>
            <div className="h-1.5 w-full rounded-full bg-cyber-white/10 overflow-hidden">
              <div className="h-full bg-cyber-cyan w-[18%]" />
            </div>
          </div>

          <div className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 space-y-2">
            <span className="text-cyber-white/40 text-[10px]">TEAM SEATS</span>
            <p className="text-lg font-bold text-cyber-purple">6 / 10 Members</p>
            <div className="h-1.5 w-full rounded-full bg-cyber-white/10 overflow-hidden">
              <div className="h-full bg-cyber-purple w-[60%]" />
            </div>
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

        <div className="divide-y divide-cyber-white/5 font-mono text-xs">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <span className="font-bold text-cyber-white">{inv.id}</span>
                <span className="text-cyber-white/40 text-[11px]">{inv.date}</span>
                <span className="rounded bg-cyber-green/10 border border-cyber-green/30 px-1.5 py-0.2 text-[9px] font-bold text-cyber-green">
                  {inv.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-cyber-white">{inv.amount}</span>
                <button
                  type="button"
                  className="rounded p-1 text-cyber-white/40 hover:text-cyber-cyan"
                  title="Download Receipt"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
