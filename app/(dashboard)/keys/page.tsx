"use client";

import { Key, Plus, RefreshCw, Trash2 } from "lucide-react";

const keys = [
  { name: "Production API", prefix: "sf_live_89a1...", lastUsed: "2m ago" },
  { name: "CI/CD Runner", prefix: "sf_live_44c2...", lastUsed: "1h ago" },
];

export default function KeysPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Key Vault</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>AES-256 encrypted API key management with auto-rotation.</p>
        </div>
        <button className="catalyst-btn-primary text-xs"><Plus className="h-3.5 w-3.5" /> Generate Key</button>
      </div>

      <div className="catalyst-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="catalyst-table">
            <thead><tr><th>Name</th><th>Key</th><th className="hidden sm:table-cell">Last Used</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.name}>
                  <td className="font-medium">{k.name}</td>
                  <td className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{k.prefix}</td>
                  <td className="hidden sm:table-cell text-xs" style={{ color: "var(--text-muted)" }}>{k.lastUsed}</td>
                  <td><span className="catalyst-badge-success text-xs">Active</span></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="catalyst-btn-ghost !p-1.5"><RefreshCw className="h-3.5 w-3.5" /></button>
                      <button className="catalyst-btn-ghost !p-1.5" style={{ color: "var(--danger)" }}><Trash2 className="h-3.5 w-3.5" /></button>
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
