"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Plus, Copy, Trash2, RotateCw, Eye, EyeOff, KeyRound } from "lucide-react";

const keys = [
  { name: "Production Key", prefix: "sf_prod_...a8f2", scopes: "read, write", status: "Active", created: "Jan 15, 2025", lastUsed: "2 min ago" },
  { name: "Staging Key", prefix: "sf_stg_...b3c1", scopes: "read, write", status: "Active", created: "Feb 3, 2025", lastUsed: "1 hr ago" },
  { name: "CI/CD Pipeline", prefix: "sf_ci_...d7e4", scopes: "deploy", status: "Active", created: "Mar 10, 2025", lastUsed: "3 days ago" },
  { name: "Old Test Key", prefix: "sf_test_...f1a9", scopes: "read", status: "Revoked", created: "Dec 1, 2024", lastUsed: "Never" },
];

export default function ApiKeysPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="API Keys"
        description="Manage authentication keys for your applications."
        actions={
          <button className="btn-primary btn-sm"><Plus size={14} /> Create Key</button>
        }
      />

      {/* Warning */}
      <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 flex items-start gap-3">
        <KeyRound size={18} className="text-yellow-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-500">Keep your keys secure</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            API keys are shown only once at creation. Store them securely and never commit them to version control.
          </p>
        </div>
      </div>

      {/* Keys Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Key</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Scopes</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Last Used</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.name} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{k.prefix}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1">
                      {k.scopes.split(", ").map((s) => (
                        <span key={s} className="badge bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[10px]">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={k.status} /></td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">{k.lastUsed}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-crimson hover:bg-crimson-soft transition-colors" title="Copy"><Copy size={14} /></button>
                      <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors" title="Rotate"><RotateCw size={14} /></button>
                      <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Revoke"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
