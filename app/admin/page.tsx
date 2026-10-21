"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminStats {
  stats: {
    totalUsers: number;
    totalProjects: number;
    totalKeys: number;
    totalCalls: number;
    totalAuditLogs: number;
    activeUsers: number;
    roles: Record<string, number>;
  };
  chartData: { date: string; calls: number }[];
  recentUsers: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    _count: { projects: number; apiKeys: number };
  }[];
  recentLogs: {
    id: string;
    action: string;
    details: string | null;
    userName: string;
    createdAt: string;
    ipAddress: string | null;
  }[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "users" | "logs">("overview");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          setData(await res.json());
        } else if (res.status === 403) {
          setError("Admin access required.");
        } else {
          setError("Failed to load admin data.");
        }
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-[var(--border)]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  const s = data?.stats;
  const chart = data?.chartData || [];
  const maxChart = Math.max(...chart.map((c) => c.calls), 1);

  const cards = [
    { label: "Total Users", value: s?.totalUsers ?? 0, color: "text-blue-400" },
    { label: "Projects", value: s?.totalProjects ?? 0, color: "text-[var(--accent)]" },
    { label: "API Keys", value: s?.totalKeys ?? 0, color: "text-purple-400" },
    { label: "API Calls", value: s?.totalCalls ?? 0, color: "text-green-400" },
    { label: "Active (7d)", value: s?.activeUsers ?? 0, color: "text-cyan-400" },
    { label: "Audit Logs", value: s?.totalAuditLogs ?? 0, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[clamp(1.3rem,3vw,1.75rem)] font-bold text-[var(--text)]">
              Admin Panel
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-bold uppercase">
              Admin
            </span>
          </div>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Platform-wide statistics and management
          </p>
        </div>
        <Link
          href="/overview"
          className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs text-[var(--muted)] mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Role breakdown */}
      {s?.roles && Object.keys(s.roles).length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {Object.entries(s.roles).map(([role, count]) => (
            <span
              key={role}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
            >
              {role}: <strong>{(count as any)?._count ?? count}</strong>
            </span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-[var(--border)] pb-3">
        {(["overview", "users", "logs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
              tab === t
                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50"
            }`}
          >
            {t === "overview" ? "30-Day Chart" : t === "users" ? "Recent Users" : "Audit Logs"}
          </button>
        ))}
      </div>

      {/* 30-day chart */}
      {tab === "overview" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
            API Calls — Last 30 Days
          </h2>
          <div className="flex items-end gap-0.5 sm:gap-1 h-40 sm:h-48 overflow-x-auto">
            {chart.length > 0 ? (
              chart.map((bar, i) => {
                const pct = (bar.calls / maxChart) * 100;
                const dayLabel = new Date(bar.date).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div
                    key={i}
                    className="flex-1 min-w-[12px] flex flex-col items-center gap-1"
                  >
                    <span className="text-[9px] text-[var(--muted)] tabular-nums">
                      {bar.calls || ""}
                    </span>
                    <div
                      className="w-full relative rounded-t-sm overflow-hidden bg-[var(--border)]/40"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-[var(--accent)] transition-all duration-500"
                        style={{ height: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                    {i % 5 === 0 && (
                      <span className="text-[8px] text-[var(--muted)] truncate w-full text-center">
                        {dayLabel}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[var(--muted)] w-full text-center py-8">
                No data yet
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recent users */}
      {tab === "users" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider hidden sm:table-cell">
                    Projects
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider hidden sm:table-cell">
                    Keys
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentUsers || []).map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text)]">
                        {u.name || "Unnamed"}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          u.role === "ADMIN"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-blue-500/15 text-blue-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] hidden sm:table-cell">
                      {u._count?.projects ?? 0}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] hidden sm:table-cell">
                      {u._count?.apiKeys ?? 0}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!data?.recentUsers || data.recentUsers.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit logs */}
      {tab === "logs" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider hidden sm:table-cell">
                    Details
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentLogs || []).map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold font-mono text-[var(--accent)]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text)]">
                      {log.userName}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] hidden sm:table-cell max-w-xs truncate">
                      {log.details || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] hidden md:table-cell whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!data?.recentLogs || data.recentLogs.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                      No audit logs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
