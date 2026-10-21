"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  totalUsers: number;
  totalProjects: number;
  totalKeys: number;
  totalRequests: number;
  activeUsers: number;
  newUsersToday: number;
  avgLatency: number;
  uptime: number;
  chart: { date: string; users: number; requests: number }[];
  topEndpoints: { endpoint: string; count: number }[];
  hourlyDistribution: { hour: number; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          setData(await res.json());
        } else {
          setError("Failed to load analytics.");
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
            <div key={i} className="h-24 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-72 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
          <div className="h-72 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
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

  const maxReq = data
    ? Math.max(...data.chart.map((c) => c.requests), 1)
    : 1;
  const maxUsers = data
    ? Math.max(...data.chart.map((c) => c.users), 1)
    : 1;
  const maxHourly = data?.hourlyDistribution
    ? Math.max(...data.hourlyDistribution.map((h) => h.count), 1)
    : 1;
  const maxEndpoint = data?.topEndpoints
    ? Math.max(...data.topEndpoints.map((e) => e.count), 1)
    : 1;

  const kpiCards = [
    { label: "Avg Latency", value: `${data?.avgLatency ?? 0}ms`, sub: "Response time", color: "text-cyan-400" },
    { label: "Uptime", value: `${data?.uptime ?? 100}%`, sub: "Last 30 days", color: "text-green-400" },
    { label: "New Today", value: data?.newUsersToday ?? 0, sub: "Registrations", color: "text-[var(--accent)]" },
    { label: "Active Users", value: data?.activeUsers ?? 0, sub: "Last 7 days", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs text-[var(--muted)] mb-1 truncate">{kpi.label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${kpi.color} truncate`}>
              {kpi.value}
            </p>
            <p className="text-[11px] text-[var(--muted)] mt-1 truncate">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Dual-axis chart: Requests + Users over 30 days */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text)]">
              30-Day Trend
            </h2>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                Requests
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Users
              </span>
            </div>
          </div>
          <div className="flex items-end gap-[2px] sm:gap-1 h-44 sm:h-52 overflow-hidden">
            {data?.chart.map((bar, i) => {
              const reqPct = (bar.requests / maxReq) * 100;
              const userPct = (bar.users / maxUsers) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 min-w-[4px] flex flex-col justify-end gap-[1px] relative group"
                  style={{ height: "100%" }}
                >
                  <div
                    className="w-full rounded-t-sm bg-blue-400/60 hover:bg-blue-400 transition-colors"
                    style={{ height: `${Math.max(userPct, 2)}%` }}
                  />
                  <div
                    className="w-full rounded-t-sm bg-[var(--accent)]/70 hover:bg-[var(--accent)] transition-colors"
                    style={{ height: `${Math.max(reqPct, 2)}%` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-[9px] text-[var(--text)] whitespace-nowrap z-10 shadow-lg">
                    <div>{bar.requests} req</div>
                    <div>{bar.users} users</div>
                  </div>
                </div>
              );
            })}
            {(!data?.chart || data.chart.length === 0) && (
              <p className="text-sm text-[var(--muted)] w-full text-center py-8">
                No data yet
              </p>
            )}
          </div>
        </div>

        {/* Hourly distribution */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
            Hourly Activity
          </h2>
          <div className="flex items-end gap-[3px] sm:gap-1 h-44 sm:h-52 overflow-hidden">
            {data?.hourlyDistribution?.map((h, i) => {
              const pct = (h.count / maxHourly) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 min-w-[6px] flex flex-col items-center justify-end relative group"
                  style={{ height: "100%" }}
                >
                  <div
                    className="w-full rounded-t-sm bg-purple-400/60 hover:bg-purple-400 transition-colors"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  />
                  {(i % 3 === 0) && (
                    <span className="text-[8px] sm:text-[9px] text-[var(--muted)] mt-1 shrink-0">
                      {String(h.hour).padStart(2, "0")}
                    </span>
                  )}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-0.5 text-[9px] text-[var(--text)] whitespace-nowrap z-10 shadow-lg">
                    {h.hour}:00 — {h.count}
                  </div>
                </div>
              );
            })}
            {(!data?.hourlyDistribution || data.hourlyDistribution.length === 0) && (
              <p className="text-sm text-[var(--muted)] w-full text-center py-8">
                No data yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top endpoints */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
          Top Endpoints
        </h2>
        {data?.topEndpoints && data.topEndpoints.length > 0 ? (
          <div className="space-y-3">
            {data.topEndpoints.slice(0, 10).map((ep, i) => {
              const pct = (ep.count / maxEndpoint) * 100;
              return (
                <div key={i} className="min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-xs sm:text-sm font-mono text-[var(--text)] truncate min-w-0">
                      {ep.endpoint}
                    </span>
                    <span className="text-xs text-[var(--muted)] tabular-nums shrink-0">
                      {ep.count.toLocaleString()} hits
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--border)]/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]/70 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)] text-center py-8">
            No endpoint data yet
          </p>
        )}
      </div>

      {/* Summary stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: data?.totalUsers ?? 0 },
          { label: "Total Projects", value: data?.totalProjects ?? 0 },
          { label: "Total API Keys", value: data?.totalKeys ?? 0 },
          { label: "Total Requests", value: data?.totalRequests ?? 0 },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center"
          >
            <p className="text-lg sm:text-xl font-bold text-[var(--text)] tabular-nums">
              {s.value.toLocaleString()}
            </p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
