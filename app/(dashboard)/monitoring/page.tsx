"use client";

import { CheckCircle2, Radio, Globe, Server } from "lucide-react";

const services = [
  { name: "Core REST API Gateway", ping: "18ms" },
  { name: "Authentication Service", ping: "22ms" },
  { name: "PostgreSQL Cluster", ping: "4ms" },
  { name: "WebSocket Gateway", ping: "12ms" },
];

const edges = [
  { region: "US East", code: "iad", latency: "14ms", traffic: "38%" },
  { region: "EU Central", code: "fra", latency: "32ms", traffic: "28%" },
  { region: "Asia East", code: "hnd", latency: "45ms", traffic: "18%" },
  { region: "SA East", code: "gru", latency: "68ms", traffic: "8%" },
];

export default function MonitoringPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Live Telemetry</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Real-time infrastructure health and edge latency.</p>
        </div>
        <span className="catalyst-badge catalyst-badge-accent flex items-center gap-1.5"><Radio className="h-3 w-3" /> All Systems Operational</span>
      </div>

      <div className="catalyst-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>60-Day Uptime</span>
          <span className="text-sm font-bold" style={{ color: "var(--success)" }}>99.985%</span>
        </div>
        <div className="flex gap-0.5 h-8">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ backgroundColor: i === 12 || i === 42 ? "var(--warning)" : "var(--success)", opacity: 0.7 }} />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}><span>60 days ago</span><span>Today</span></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="catalyst-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text)" }}><Server className="h-4 w-4" style={{ color: "var(--text-muted)" }} /> Service Status</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {services.map((s) => (
              <div key={s.name} className="flex items-center justify-between px-5 py-3 text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--success)" }} /><span style={{ color: "var(--text)" }}>{s.name}</span></div>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{s.ping}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="catalyst-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text)" }}><Globe className="h-4 w-4" style={{ color: "var(--text-muted)" }} /> Edge Latency</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {edges.map((e) => (
              <div key={e.code} className="flex items-center justify-between px-5 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold" style={{ backgroundColor: "var(--surface-muted)", color: "var(--text-muted)" }}>{e.code}</span>
                  <span style={{ color: "var(--text)" }}>{e.region}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  <span>{e.latency}</span><span>{e.traffic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
