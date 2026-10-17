"use client";

import { BarChart3, TrendingUp, Users, Activity, Globe, Clock } from "lucide-react";

const metrics = [
  { label: "Total API Calls (30d)", value: "34.2M", change: "+18.4%", icon: Activity },
  { label: "Active Users (DAU)", value: "1,247", change: "+6.2%", icon: Users },
  { label: "Avg Response Time", value: "38ms", change: "-12ms", icon: Clock },
  { label: "Global Edge Hits", value: "8.9M", change: "+22.1%", icon: Globe },
];

const topEndpoints = [
  { path: "POST /api/v1/generate", calls: "2.4M", latency: "1.2s", errors: "0.3%" },
  { path: "GET /api/v1/health", calls: "18.1M", latency: "4ms", errors: "0.0%" },
  { path: "POST /api/v1/security/scan", calls: "890K", latency: "3.4s", errors: "0.1%" },
  { path: "POST /api/v1/performance/test", calls: "340K", latency: "8.2s", errors: "0.5%" },
  { path: "POST /api/v1/deploy", calls: "120K", latency: "2.1s", errors: "1.2%" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-display-sm" style={{ color: "var(--text)" }}>Platform Analytics</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Usage metrics, traffic patterns, and performance telemetry.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="catalyst-card p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{m.label}</p>
                <Icon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="mt-2 text-2xl font-bold" style={{ color: "var(--text)" }}>{m.value}</p>
              <p className="mt-1 text-xs font-medium" style={{ color: "var(--success)" }}>
                <TrendingUp className="inline h-3 w-3 mr-1" />{m.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="catalyst-card overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Top Endpoints by Volume</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--surface-muted)" }}>
                {["Endpoint", "Calls (30d)", "Avg Latency", "Error Rate"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {topEndpoints.map((ep) => (
                <tr key={ep.path} className="hover:bg-[var(--surface-muted)]">
                  <td className="px-5 py-3 font-mono text-xs font-medium" style={{ color: "var(--text)" }}>{ep.path}</td>
                  <td className="px-5 py-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{ep.calls}</td>
                  <td className="px-5 py-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{ep.latency}</td>
                  <td className="px-5 py-3 text-xs font-mono font-bold" style={{ color: parseFloat(ep.errors) > 1 ? "var(--danger)" : "var(--success)" }}>{ep.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
