"use client";

import { useState } from "react";
import { AlertOctagon, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function DangerZone() {
  const { user } = useAuth();
  const [purging, setPurging] = useState(false);

  const handleDeleteAll = async () => {
    const confirmation = prompt(
      'Type "DELETE ALL APIS" to confirm catastrophic workspace reset:'
    );
    if (confirmation !== "DELETE ALL APIS") return;

    setPurging(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      const projects = data.projects || [];

      for (const p of projects) {
        await fetch(`/api/projects?id=${p.id}`, { method: "DELETE" });
      }
      alert(`Purged ${projects.length} project(s).`);
    } catch {
      alert("Failed to purge projects.");
    } finally {
      setPurging(false);
    }
  };

  const handleTerminateAccount = () => {
    const confirmation = prompt(
      'Type your email address to confirm permanent account deletion:'
    );
    if (confirmation === user?.email) {
      alert(
        "Account deletion is not yet implemented. Contact support for assistance."
      );
    } else if (confirmation) {
      alert("Email did not match. Deletion cancelled.");
    }
  };

  return (
    <div className="glass-card p-6 border-cyber-red/30 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <AlertOctagon className="h-5 w-5 text-cyber-red" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">
              Danger Zone &amp; Data Purging
            </h3>
            <p className="text-xs text-cyber-white/40 font-mono">
              Irreversible destruction of API definitions and deployed containers
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-cyber-red/20 bg-cyber-red/5 p-4">
          <div>
            <h4 className="text-sm font-bold text-cyber-white">
              Purge All Generated Projects
            </h4>
            <p className="text-xs text-cyber-white/50">
              Permanently delete all projects, endpoints, and cached code blocks.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={purging}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-cyber-red/40 bg-cyber-red/20 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyber-red hover:bg-cyber-red/30 transition-all shrink-0 disabled:opacity-40"
          >
            {purging ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {purging ? "Purging…" : "Purge Projects"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-cyber-red/20 bg-cyber-red/5 p-4">
          <div>
            <h4 className="text-sm font-bold text-cyber-white">Close Account</h4>
            <p className="text-xs text-cyber-white/50">
              Permanently delete your account and all associated data.
            </p>
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
