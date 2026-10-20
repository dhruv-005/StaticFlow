"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalKeys: number;
  totalRequests: number;
  activeUsers: number;
  newUsersToday: number;
  roleBreakdown: { role: string; count: number }[];
  chart: { date: string; users: number; requests: number }[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          setStats(await res.json());
        } else {
          setError("Failed to load admin stats.");
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
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
          <div className="h-64 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400 text-sm break-words">
        {error}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      sub: `${stats?.newUsersToday ?? 0} joined today`,
      color: "text-[var(--accent)]",
    },
    {
      label: "Active Users",
      value: stats?.activeUsers ?? 0,
      sub: "Last 7 days",
      color: "text-green-400",
    },
    {
      label: "Projects",
      value: stats?.totalProjects ?? 0,
      sub: "Across all users",
      color: "text-blue-400",
    },
    {
      label: "API Requests",
      value: stats?.totalRequests ?? 0,
      sub: "All time",
      color: "text-purple-400",
    },
  ];

  const maxReq = stats
    ? Math.max(...stats.chart.map((c) => c.requests), 1)
    : 1;
  const maxUsers = stats
    ? Math.max(...stats.chart.map((c) => c.users), 1)
    : 1;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
          >
            <p className="text-xs sm:text-sm text-[var(--muted)] mb-1 truncate">
              {card.label}
            </p>
            <p className={`text-xl sm:text-2xl font-bold ${card.color} truncate`}>
              {card.value.toLocaleString()}
            </p>
            <p className="text-[11px] sm:text-xs text-[var(--muted)] mt-1 truncate">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 30-day requests chart */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
            Requests — Last 30 Days
          </h2>
          <div className="flex items-end gap-[2px] sm:gap-1 h-40 sm:h-48 overflow-hidden">
            {stats?.chart.map((bar, i) => {
              const pct = (bar.requests / maxReq) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 min-w-[4px] rounded-t-sm bg-[var(--accent)]/70 hover:bg-[var(--accent)] transition-colors relative group"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                  title={`${bar.date}: ${bar.requests} req`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-[10px] text-[var(--text)] whitespace-nowrap z-10 shadow-lg">
                    {bar.requests} req
                  </div>
                </div>
              );
            })}
            {(!stats?.chart || stats.chart.length === 0) && (
              <p className="text-sm text-[var(--muted)] w-full text-center py-8">
                No data yet
              </p>
            )}
          </div>
        </div>

        {/* Role breakdown + quick actions */}
        <div className="space-y-4">
          {/* Role breakdown */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
              Users by Role
            </h2>
            <div className="space-y-3">
              {stats?.roleBreakdown.map((r) => {
                const total = stats.totalUsers || 1;
                const pct = Math.round((r.count / total) * 100);
                return (
                  <div key={r.role}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--text)] font-medium">
                        {r.role}
                      </span>
                      <span className="text-xs text-[var(--muted)] tabular-nums">
                        {r.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border)]/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          r.role === "ADMIN"
                            ? "bg-[var(--accent)]"
                            : "bg-blue-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {(!stats?.roleBreakdown || stats.roleBreakdown.length === 0) && (
                <p className="text-sm text-[var(--muted)] text-center py-4">
                  No data
                </p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/users", label: "Manage Users", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
              { href: "/admin/logs", label: "Audit Logs", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" },
              { href: "/admin/analytics", label: "Analytics", icon: "M18 20V10M12 20V4M6 20v-6" },
              { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 hover:border-[var(--accent)]/40 transition-colors group flex items-center gap-3"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="shrink-0 group-hover:stroke-[var(--accent)] transition-colors"
                >
                  <path d={action.icon} />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
