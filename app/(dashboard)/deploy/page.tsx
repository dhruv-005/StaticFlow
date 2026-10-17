"use client";

import { useState } from "react";
import { Rocket, Clock, Server } from "lucide-react";

const platforms = [
  { id: "vercel", name: "Vercel Edge", desc: "Global serverless deployment", free: true },
  { id: "render", name: "Render", desc: "Auto-scaling web service", free: true },
  { id: "flyio", name: "Fly.io", desc: "Global micro-VMs", free: true },
];

const history = [
  { commit: "feat: add checkout webhook", platform: "Vercel", status: "Live", time: "10m ago", dur: "34s" },
  { commit: "fix: optimize SQL queries", platform: "Vercel", status: "Rolled Back", time: "3h ago", dur: "42s" },
  { commit: "initial: scaffold endpoints", platform: "Fly.io", status: "Completed", time: "1d ago", dur: "58s" },
];

export default function DeployPage() {
  const [selected, setSelected] = useState("vercel");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Cloud Deployer</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>One-click deployment to serverless edges and cloud containers.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="catalyst-card p-5 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text)" }}><Server className="h-4 w-4" style={{ color: "var(--text-muted)" }} /> Target Platform</h3>
            {platforms.map((p) => (
              <button key={p.id} onClick={() => setSelected(p.id)} className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all" style={{ borderColor: selected === p.id ? "var(--accent)" : "var(--border)", backgroundColor: selected === p.id ? "var(--surface-muted)" : "var(--surface)" }}>
                <div><p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.name}</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.desc}</p></div>
                {p.free && <span className="text-[10px] font-bold" style={{ color: "var(--success)" }}>FREE</span>}
              </button>
            ))}
          </div>
          <button className="catalyst-btn-primary w-full"><Rocket className="h-4 w-4" /> Deploy to {platforms.find((p) => p.id === selected)?.name}</button>
        </div>

        <div className="catalyst-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}><h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Deployment History</h3></div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {history.map((d, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{d.commit}</p>
                  <span className="text-xs font-medium" style={{ color: d.status === "Live" ? "var(--success)" : d.status === "Rolled Back" ? "var(--danger)" : "var(--text-muted)" }}>{d.status}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                  <span>{d.platform}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{d.time}</span><span>{d.dur}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
