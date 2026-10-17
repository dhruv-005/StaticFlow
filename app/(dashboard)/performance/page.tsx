	"use client";

import { useState } from "react";
import { Activity, Users, Flame, Zap, Waves } from "lucide-react";

const profiles = [
  { type: "load", label: "Load Test", desc: "Standard concurrent traffic", icon: Users, vu: 100, dur: 30 },
  { type: "stress", label: "Stress Test", desc: "Find breaking point", icon: Flame, vu: 500, dur: 60 },
  { type: "spike", label: "Spike Test", desc: "Sudden traffic burst", icon: Zap, vu: 1000, dur: 15 },
  { type: "soak", label: "Soak Test", desc: "Detect memory leaks", icon: Waves, vu: 250, dur: 120 },
];

export default function PerformancePage() {
  const [selected, setSelected] = useState("load");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Performance Lab</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Simulate user concurrency and detect latency bottlenecks.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="catalyst-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Avg Latency</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "var(--text)" }}>32<span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>ms</span></p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>P95: 48ms · P99: 65ms</p>
        </div>
        <div className="catalyst-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Throughput</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "var(--text)" }}>1.2K<span className="text-base font-normal" style={{ color: "var(--text-muted)" }}> req/s</span></p>
        </div>
        <div className="catalyst-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Error Rate</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "var(--success)" }}>0.01<span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>%</span></p>
        </div>
      </div>

      <div className="catalyst-card p-6 space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Benchmark Profiles</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map((p) => {
            const Icon = p.icon;
            const active = selected === p.type;
            return (
              <button key={p.type} onClick={() => setSelected(p.type)} className="rounded-xl border p-4 text-left transition-all" style={{ borderColor: active ? "var(--accent)" : "var(--border)", backgroundColor: active ? "var(--surface-muted)" : "var(--surface)" }}>
                <Icon className="mb-2 h-5 w-5" style={{ color: active ? "var(--text)" : "var(--text-muted)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.label}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                <p className="mt-2 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{p.vu} VUs · {p.dur}s</p>
              </button>
            );
          })}
        </div>
        <button className="catalyst-btn-primary w-full sm:w-auto"><Activity className="h-4 w-4" /> Start {profiles.find((p) => p.type === selected)?.label}</button>
      </div>
    </div>
  );
}
