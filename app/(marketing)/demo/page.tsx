"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle2, Terminal } from "lucide-react";

const steps = ["Parsing intent...", "Designing schema...", "Generating 24 endpoints...", "Adding JWT auth...", "Running security scan...", "Generating docs...", "Preparing deploy..."];

export default function DemoPage() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  const run = async () => {
    setRunning(true); setDone(false); setStep(0);
    for (let i = 0; i < steps.length; i++) { setStep(i); await new Promise((r) => setTimeout(r, 500)); }
    setDone(true); setRunning(false);
  };

  return (
    <div className="flex flex-col">
      <section className="catalyst-section pt-32">
        <div className="catalyst-container-narrow text-center">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Try it <span style={{ color: "var(--text-muted)" }}>live.</span></h1>
          <p className="mt-4 text-base" style={{ color: "var(--text-muted)" }}>Watch StaticFlow generate a complete API from a single prompt.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="catalyst-container">
          <div className="catalyst-card overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2"><Terminal className="h-4 w-4" style={{ color: "var(--text-muted)" }} /><span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>staticflow-demo</span></div>
              <button onClick={run} disabled={running} className="catalyst-btn-primary !py-1.5 !px-3 text-xs disabled:opacity-50">
                {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />} {running ? "Building..." : "Run Demo"}
              </button>
            </div>
            <div className="grid lg:grid-cols-2">
              <div className="border-b p-6 lg:border-b-0 lg:border-r" style={{ borderColor: "var(--border)" }}>
                <p className="mb-4 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Build Log</p>
                <div className="space-y-2">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: i < step || done ? "var(--success)" : i === step ? "var(--text)" : "var(--text-muted)" }}>
                      {i < step || done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i === step ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <div className="h-3.5 w-3.5 rounded-full border" style={{ borderColor: "var(--border)" }} />}
                      <span className="font-mono">{s}</span>
                    </div>
                  ))}
                </div>
                {done && <div className="mt-4 rounded-lg border p-3 text-xs font-medium" style={{ borderColor: "var(--success)", color: "var(--success)" }}>Build complete — 24 endpoints in 3.5s</div>}
              </div>
              <div className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Generated Code</p>
                <pre className="rounded-lg border p-4 text-xs overflow-auto max-h-[300px] font-mono" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-muted)", color: "var(--text)" }}>
                  <code>{done || running ? "import express from 'express';\nconst app = express();\napp.use(express.json());\napp.get('/health', (req, res) =>\n  res.json({ status: 'live' })\n);\napp.listen(3000);" : "// Click 'Run Demo' to generate code..."}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
