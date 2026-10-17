"use client";

import Link from "next/link";
import { Code2, Shield, Activity, Rocket, TrendingUp, ArrowRight, CheckCircle2, Clock } from "lucide-react";

const kpis = [
  { label: "Total APIs", value: "12", change: "+3 this week", icon: Code2 },
  { label: "Security Score", value: "A+", change: "95/100 avg", icon: Shield },
  { label: "Avg Latency", value: "32ms", change: "-8ms vs last week", icon: Activity },
  { label: "Deployments", value: "28", change: "100% success", icon: Rocket },
];

const projects = [
  { name: "E-Commerce API", status: "Live", score: "A+", endpoints: 34, updated: "2h ago" },
  { name: "Blog Platform", status: "Live", score: "A", endpoints: 24, updated: "1d ago" },
  { name: "Healthcare Records", status: "Testing", score: "B+", endpoints: 18, updated: "3d ago" },
  { name: "Real-Time Chat", status: "Draft", score: "—", endpoints: 12, updated: "5d ago" },
];

const statusColor: Record<string, string> = { Live: "var(--success)", Testing: "var(--warning)", Draft: "var(--text-muted)" };

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          Welcome back, <span style={{ color: "var(--text-muted)" }}>Jane</span>
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Here is an overview of your API infrastructure and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="catalyst-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{k.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>{k.value}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--surface-muted)" }}>
                  <Icon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs" style={{ color: "var(--success)" }}>
                <TrendingUp className="h-3 w-3" /> {k.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/builder", icon: Code2, title: "Build New API", desc: "Generate from prompt" },
          { href: "/security", icon: Shield, title: "Run Security Scan", desc: "OWASP Top 10 audit" },
          { href: "/deploy", icon: Rocket, title: "Deploy to Cloud", desc: "One-click rollout" },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="catalyst-card catalyst-card-hover flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--accent)" }}>
              <a.icon className="h-4 w-4" style={{ color: "var(--accent-text)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{a.title}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="catalyst-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Recent Projects</h3>
          <Link href="/builder" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="catalyst-table">
            <thead>
              <tr>
                <th>Project</th>
                <th className="hidden sm:table-cell">Status</th>
                <th className="hidden md:table-cell">Security</th>
                <th className="hidden md:table-cell">Endpoints</th>
                <th className="hidden lg:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.name}>
                  <td className="font-medium">{p.name}</td>
                  <td className="hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: statusColor[p.status] }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColor[p.status] }} />{p.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell font-mono text-xs" style={{ color: p.score === "A+" ? "var(--success)" : p.score === "A" ? "var(--success)" : "var(--warning)" }}>{p.score}</td>
                  <td className="hidden md:table-cell font-mono text-xs" style={{ color: "var(--text-muted)" }}>{p.endpoints}</td>
                  <td className="hidden lg:table-cell text-xs" style={{ color: "var(--text-muted)" }}>{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
