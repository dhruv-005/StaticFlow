"use client";

import { useEffect, useState } from "react";

interface PlatformStats {
  totalProjects: number;
  totalUsers: number;
  totalApiCalls: number;
  totalKeys: number;
  uptime: number;
}

export function TrustBar() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const metrics = [
    {
      value: stats ? `${stats.totalApiCalls.toLocaleString()}+` : "—",
      label: "API Calls Served",
    },
    {
      value: stats ? `${stats.uptime}%` : "—",
      label: "Platform Uptime",
    },
    {
      value: stats ? `${stats.totalProjects.toLocaleString()}+` : "—",
      label: "APIs Generated",
    },
    {
      value: stats ? `${stats.totalUsers.toLocaleString()}+` : "—",
      label: "Developers",
    },
  ];

  return (
    <section className="border-y" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
      <div className="catalyst-container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 lg:gap-12">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>{m.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
