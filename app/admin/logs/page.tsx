"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MethodBadge, StatusBadge } from "@/components/ui/badge";
import { Search, Filter, Download, RefreshCw, Clock } from "lucide-react";

const logs = [
  { id: 1, time: "2025-04-15 14:32:01", actor: "dhruv@api.com", action: "USER_CREATED", resource: "User: sarah@dev.io", result: "Success", ip: "192.168.1.45" },
  { id: 2, time: "2025-04-15 14:28:17", actor: "admin@api.com", action: "ROLE_ASSIGNED", resource: "User: mike@startup.co → Admin", result: "Success", ip: "10.0.0.12" },
  { id: 3, time: "2025-04-15 13:55:42", actor: "vatsal@api.com", action: "API_KEY_CREATED", resource: "Key: sf_prod_...a8f2", result: "Success", ip: "172.16.0.8" },
  { id: 4, time: "2025-04-15 13:12:08", actor: "sarah@dev.io", action: "PROJECT_DEPLOYED", resource: "Project: Task Manager API", result: "Success", ip: "203.0.113.42" },
  { id: 5, time: "2025-04-15 12:45:33", actor: "system", action: "RATE_LIMIT_HIT", resource: "IP: 198.51.100.7", result: "Warning", ip: "198.51.100.7" },
  { id: 6, time: "2025-04-15 11:20:19", actor: "mike@startup.co", action: "LOGIN_FAILED", resource: "User: mike@startup.co", result: "Failed", ip: "192.0.2.88" },
  { id: 7, time: "2025-04-15 10:05:44", actor: "dhruv@api.com", action: "API_KEY_REVOKED", resource: "Key: sf_test_...f1a9", result: "Success", ip: "192.168.1.45" },
  { id: 8, time: "2025-04-15 09:30:12", actor: "system", action: "DEPLOYMENT_FAILED", resource: "Project: E-commerce v1.1.9", result: "Failed", ip: "—" },
  { id: 9, time: "2025-04-14 22:15:08", actor: "admin@api.com", action: "USER_SUSPENDED", resource: "User: jordan@freelance.me", result: "Success", ip: "10.0.0.12" },
  { id: 10, time: "2025-04-14 18:42:55", actor: "vatsal@api.com", action: "SETTINGS_UPDATED", resource: "System: Rate Limits", result: "Success", ip: "172.16.0.8" },
];

export default function AdminLogsPage() {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");

  const results = ["ALL", "Success", "Warning", "Failed"];

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase());
    const matchResult = resultFilter === "ALL" || l.result === resultFilter;
    return matchSearch && matchResult;
  });

  const resultVariant = (r: string) => {
    if (r === "Success") return "green";
    if (r === "Warning") return "yellow";
    if (r === "Failed") return "red";
    return "default";
  };

  const actionColor = (a: string) => {
    if (a.includes("FAILED") || a.includes("REVOKED") || a.includes("SUSPENDED")) return "text-crimson";
    if (a.includes("WARNING") || a.includes("RATE")) return "text-yellow-500";
    return "text-[var(--text-primary)]";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Audit Logs"
        description="Track all actions across the platform."
        actions={
          <>
            <button className="btn-secondary btn-sm"><RefreshCw size={14} /> Refresh</button>
            <button className="btn-secondary btn-sm"><Download size={14} /> Export</button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, action, or resource..."
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-0.5">
          {results.map((r) => (
            <button
              key={r}
              onClick={() => setResultFilter(r)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                resultFilter === r
                  ? "bg-crimson text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Resource</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Result</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden xl:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)] hidden lg:table-cell whitespace-nowrap">
                    <span className="flex items-center gap-1"><Clock size={10} /> {l.time}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs ${l.actor === "system" ? "text-yellow-500" : "text-[var(--text-primary)]"}`}>
                      {l.actor}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs font-medium ${actionColor(l.action)}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)] hidden md:table-cell max-w-[200px] truncate">
                    {l.resource}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.result} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)] hidden xl:table-cell">
                    {l.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-[var(--text-muted)]">
            No logs match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>Showing {filtered.length} of {logs.length} entries</span>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs hover:border-crimson transition-colors">Previous</button>
          <button className="px-3 py-1.5 rounded-lg bg-crimson text-white text-xs">1</button>
          <button className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs hover:border-crimson transition-colors">2</button>
          <button className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs hover:border-crimson transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
