"use client";

import { useEffect, useState } from "react";
import { FolderCode, Activity, Clock, Key } from "lucide-react";

interface Stats {
  totalProjects: number;
  totalCalls: number;
  avgLatency: number;
  activeKeys: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/overview")
      .then((r) => r.json())
      .then((data) =>
        setStats({
          totalProjects: data.totalProjects ?? 0,
          totalCalls: data.totalCalls ?? 0,
          avgLatency: data.avgLatency ?? 0,
          activeKeys: data.activeKeys ?? 0,
        })
      )
      .catch(() =>
        setStats({ totalProjects: 0, totalCalls: 0, avgLatency: 0, activeKeys: 0 })
      )
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "API Projects",
      value: stats?.totalProjects ?? 0,
      suffix: "",
      icon: FolderCode,
      color: "text-cyber-cyan",
      bg: "bg-cyber-cyan/10 border-cyber-cyan/30",
    },
    {
      label: "Total API Calls",
      value: stats?.totalCalls ?? 0,
      suffix: "",
      icon: Activity,
      color: "text-cyber-green",
      bg: "bg-cyber-green/10 border-cyber-green/30",
    },
    {
      label: "Avg Latency",
      value: stats?.avgLatency ?? 0,
      suffix: "ms",
      icon: Clock,
      color: "text-cyber-purple",
      bg: "bg-cyber-purple/10 border-cyber-purple/30",
    },
    {
      label: "Active Keys",
      value: stats?.activeKeys ?? 0,
      suffix: "",
      icon: Key,
      color: "text-cyber-pink",
      bg: "bg-cyber-pink/10 border-cyber-pink/30",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="glass-card p-5 border-cyber-white/10 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyber-white/40">
              {c.label}
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg border ${c.bg}`}
            >
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </div>
          </div>
          {loading ? (
            <div className="h-7 w-16 animate-pulse rounded bg-cyber-white/10" />
          ) : (
            <p className={`text-2xl font-bold font-mono ${c.color}`}>
              {c.value.toLocaleString()}
              {c.suffix && (
                <span className="text-sm text-cyber-white/40 ml-1">
                  {c.suffix}
                </span>
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
