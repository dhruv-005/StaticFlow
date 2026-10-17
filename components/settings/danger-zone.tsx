"use client";

import { AlertOctagon, Trash2 } from "lucide-react";

export function DangerZone() {
  const handleDeleteAll = () => {
    const confirmation = prompt('Type "DELETE ALL APIS" to confirm catastrophic workspace reset:');
    if (confirmation === "DELETE ALL APIS") {
      alert("All microservice definitions purged.");
    }
  };

  const handleTerminateAccount = () => {
    const confirmation = prompt('Type your organization slug to confirm permanent account deletion:');
    if (confirmation) {
      alert("Account deletion scheduled with 14-day grace period.");
    }
  };

  return (
    <div className="glass-card p-6 border-cyber-red/30 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <AlertOctagon className="h-5 w-5 text-cyber-red" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Danger Zone &amp; Data Purging</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Irreversible destruction of API definitions, secrets, and deployed containers</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-cyber-red/20 bg-cyber-red/5 p-4">
          <div>
            <h4 className="text-sm font-bold text-cyber-white">Purge All Generated Microservices</h4>
            <p className="text-xs text-cyber-white/50">Permanently delete all route schemas, database migrations, and cached code blocks.</p>
          </div>
          <button
            type="button"
            onClick={handleDeleteAll}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-cyber-red/40 bg-cyber-red/20 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyber-red hover:bg-cyber-red/30 transition-all shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" /> Purge Projects
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-cyber-red/20 bg-cyber-red/5 p-4">
          <div>
            <h4 className="text-sm font-bold text-cyber-white">Close Organization Account</h4>
            <p className="text-xs text-cyber-white/50">Cancel Pro subscriptions, revoke all active cryptographic keys, and erase user accounts.</p>
          </div>
          <button
            type="button"
            onClick={handleTerminateAccount}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-cyber-red/40 bg-cyber-red/20 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyber-red hover:bg-cyber-red/30 transition-all shrink-0"
          >
            <AlertOctagon className="h-3.5 w-3.5" /> Close Account
          </button>
        </div>
      </div>
    </div>
  );
}
