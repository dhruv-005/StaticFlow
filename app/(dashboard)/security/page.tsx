"use client";

import { useState } from "react";
import { Shield, CheckCircle2, AlertTriangle, Info, Wrench, ChevronDown, ChevronUp } from "lucide-react";

const vulns = [
  { severity: "low", title: "Missing Strict-Transport-Security Header", cat: "A05:2021", fix: "Add helmet.hsts() middleware.", fixable: true },
  { severity: "info", title: "CORS wildcard in development config", cat: "A01:2021", fix: "Restrict origins in production.", fixable: true },
];

const sevColor: Record<string, string> = { critical: "var(--danger)", high: "var(--danger)", medium: "var(--warning)", low: "var(--info)", info: "var(--text-muted)" };

export default function SecurityPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Security Scanner</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Automated OWASP Top 10 vulnerability detection with AI-powered analysis.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="catalyst-card p-6 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: "var(--surface-muted)", border: "3px solid var(--success)" }}>
            <span className="text-2xl font-bold" style={{ color: "var(--success)" }}>A+</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Security Score</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>95 / 100</p>
        </div>
        <div className="catalyst-card p-6 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Severity Breakdown</p>
          {[{ l: "Critical", c: 0 }, { l: "High", c: 0 }, { l: "Medium", c: 0 }, { l: "Low", c: 1 }, { l: "Info", c: 1 }].map((s) => (
            <div key={s.l} className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>{s.l}</span>
              <span className="font-bold" style={{ color: s.c > 0 ? sevColor[s.l.toLowerCase()] : "var(--success)" }}>{s.c}</span>
            </div>
          ))}
        </div>
        <div className="catalyst-card p-6 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Scan Summary</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Scan Type</span><span className="font-semibold" style={{ color: "var(--text)" }}>Deep</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Tests Run</span><span className="font-semibold" style={{ color: "var(--text)" }}>800</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Auto-Fixable</span><span className="font-semibold" style={{ color: "var(--success)" }}>2 issues</span></div>
          </div>
        </div>
      </div>

      <div className="catalyst-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Findings ({vulns.length})</h3>
          <button className="catalyst-btn-primary !py-1.5 !px-3 text-xs"><Wrench className="h-3 w-3" /> Apply All Fixes</button>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {vulns.map((v, i) => (
            <div key={i}>
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--surface-muted)]">
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4" style={{ color: sevColor[v.severity] }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{v.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{v.cat}</p>
                  </div>
                </div>
                {expanded === i ? <ChevronUp className="h-4 w-4" style={{ color: "var(--text-muted)" }} /> : <ChevronDown className="h-4 w-4" style={{ color: "var(--text-muted)" }} />}
              </button>
              {expanded === i && (
                <div className="px-5 pb-4 space-y-3" style={{ backgroundColor: "var(--surface-muted)" }}>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{v.fix}</p>
                  {v.fixable && <button className="catalyst-btn-primary !py-1.5 !px-3 text-xs"><Wrench className="h-3 w-3" /> Auto-Fix</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
