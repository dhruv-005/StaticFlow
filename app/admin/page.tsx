"use client";

import {
  Users,
  FolderKanban,
  Activity,
  Shield,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const kpis = [
  { label: "Total Users", value: "2,847", change: "+12.5%", trend: "up" as const, icon: Users },
  { label: "Active Projects", value: "1,204", change: "+8.3%", trend: "up" as const, icon: FolderKanban },
  { label: "API Calls (24h)", value: "1.2M", change: "-2.1%", trend: "down" as const, icon: Activity },
  { label: "Security Score", value: "96.4", change: "+1.2", trend: "up" as const, icon: Shield },
];

const recentActivity = [
  { user: "Sarah Chen", action: "deployed E-Commerce API to Vercel", time: "5m ago", type: "success" },
  { user: "Marcus Johnson", action: "triggered OWASP deep scan", time: "12m ago", type: "info" },
  { user: "Priya Patel", action: "rotated production API keys", time: "28m ago", type: "warning" },
  { user: "Alex Rivera", action: "created new team workspace", time: "1h ago", type: "success" },
  { user: "David Kim", action: "reported billing discrepancy", time: "2h ago", type: "danger" },
];

const typeColors: Record<string, string> = {
  success: "var(--success)",
  info: "var(--info)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-display-sm" style={{ color: "var(--text)" }}>Admin Overview</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Platform-wide metrics, user activity, and system health.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="catalyst-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {kpi.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                    {kpi.value}
                  </p>
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "var(--surface-muted)" }}
                >
                  <Icon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" style={{ color: "var(--success)" }} />
                ) : (
                  <TrendingDown className="h-3 w-3" style={{ color: "var(--danger)" }} />
                )}
                <span style={{ color: kpi.trend === "up" ? "var(--success)" : "var(--danger)" }}>
                  {kpi.change}
                </span>
                <span style={{ color: "var(--text-muted)" }}>vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="catalyst-card overflow-hidden lg:col-span-2">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Recent Activity</h3>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <div
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: typeColors[item.type] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    <span className="font-semibold">{item.user}</span>{" "}
                    <span style={{ color: "var(--text-muted)" }}>{item.action}</span>
                  </p>
                </div>
                <span className="shrink-0 flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Clock className="h-3 w-3" /> {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="catalyst-card p-5 space-y-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>System Health</h3>
          {[
            { name: "API Gateway", status: "Operational", ok: true },
            { name: "AI Engine", status: "Operational", ok: true },
            { name: "Database Cluster", status: "Operational", ok: true },
            { name: "CDN Edge Nodes", status: "Degraded", ok: false },
            { name: "Auth Service", status: "Operational", ok: true },
          ].map((svc) => (
            <div key={svc.name} className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text)" }}>{svc.name}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: svc.ok ? "var(--success)" : "var(--warning)" }}>
                {svc.ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
