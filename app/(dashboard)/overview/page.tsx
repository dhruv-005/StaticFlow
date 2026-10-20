"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalProjects: number;
  totalKeys: number;
  totalRequests: number;
  uptime: number;
  avgLatency: number;
  activeKeys: number;
  chart: { date: string; count: number }[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, notifRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/notifications"),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications(data.slice(0, 5));
        }
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      /* silent */
    }
  };

  const maxChart = stats
    ? Math.max(...stats.chart.map((c) => c.count), 1)
    : 1;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-[var(--border)]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
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
      label: "Projects",
      value: stats?.totalProjects ?? 0,
      sub: "Total created",
      color: "text-[var(--accent)]",
    },
    {
      label: "API Keys",
      value: stats?.activeKeys ?? 0,
      sub: `${stats?.totalKeys ?? 0} total`,
      color: "text-blue-400",
    },
    {
      label: "Requests",
      value: stats?.totalRequests ?? 0,
      sub: "All time",
      color: "text-purple-400",
    },
    {
      label: "Uptime",
      value: `${stats?.uptime ?? 100}%`,
      sub: `${stats?.avgLatency ?? 0}ms avg`,
      color: "text-green-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.3rem,3vw,1.75rem)] font-bold text-[var(--text)]">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Your platform at a glance
          </p>
        </div>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-all w-fit"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New API
        </Link>
      </div>

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
              {card.value}
            </p>
            <p className="text-[11px] sm:text-xs text-[var(--muted)] mt-1 truncate">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Notifications row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 7-day chart */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
            Requests — Last 7 Days
          </h2>
          <div className="flex items-end gap-1.5 sm:gap-2 h-40 sm:h-48">
            {stats?.chart.map((bar, i) => {
              const pct = (bar.count / maxChart) * 100;
              const dayLabel = new Date(bar.date).toLocaleDateString("en", {
                weekday: "short",
              });
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 min-w-0"
                >
                  <span className="text-[10px] sm:text-xs text-[var(--muted)] tabular-nums">
                    {bar.count}
                  </span>
                  <div className="w-full relative rounded-t-md overflow-hidden bg-[var(--border)]/40" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-md bg-[var(--accent)] transition-all duration-500"
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--muted)] truncate w-full text-center">
                    {dayLabel}
                  </span>
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

        {/* Notifications */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
            Notifications
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
            {notifications.length === 0 && (
              <p className="text-sm text-[var(--muted)] text-center py-6">
                All caught up!
              </p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`w-full text-left rounded-lg p-3 transition-colors min-w-0 ${
                  n.read
                    ? "bg-transparent"
                    : "bg-[var(--accent)]/5 border border-[var(--accent)]/20"
                }`}
              >
                <p className="text-sm font-medium text-[var(--text)] truncate">
                  {n.title}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5 break-words line-clamp-2">
                  {n.message}
                </p>
                <p className="text-[10px] text-[var(--muted)] mt-1">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            href: "/builder",
            title: "Build an API",
            desc: "Describe your data and get a live endpoint in seconds.",
          },
          {
            href: "/projects",
            title: "View Projects",
            desc: "Manage all your generated APIs and endpoints.",
          },
          {
            href: "/overview",
            title: "API Keys",
            desc: "Create and manage keys for your applications.",
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 hover:border-[var(--accent)]/40 transition-colors group"
          >
            <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              {link.title}
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1 break-words">
              {link.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
