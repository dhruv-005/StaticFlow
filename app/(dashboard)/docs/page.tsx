"use client";

import { useState } from "react";
import { Play, Send, FileText, BookOpen } from "lucide-react";

const endpoints = [
  { method: "GET", path: "/api/v1/health", summary: "Health Check", auth: false, response: { status: "healthy", uptime: 3600 } },
  { method: "POST", path: "/api/v1/auth/login", summary: "User Login", auth: false, response: { token: "eyJhbGci...", user: { id: "usr_1" } } },
  { method: "GET", path: "/api/v1/products", summary: "List Products", auth: true, response: { items: [{ id: 1, name: "Widget" }], total: 42 } },
  { method: "POST", path: "/api/v1/orders", summary: "Create Order", auth: true, response: { orderId: "ord_88", status: "paid" } },
];

export default function DocsPage() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<"ref" | "play" | "spec">("ref");
  const [result, setResult] = useState<string | null>(null);
  const ep = endpoints[selected];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>API Documentation</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Interactive specs, live sandbox, and OpenAPI 3.1 definitions.</p>
      </div>

      <div className="flex gap-1.5 border-b pb-3 text-sm" style={{ borderColor: "var(--border)" }}>
        {(["ref", "play", "spec"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setResult(null); }} className="catalyst-btn-ghost text-xs" style={tab === t ? { backgroundColor: "var(--surface-muted)", color: "var(--text)" } : {}}>
            {t === "ref" ? "Reference" : t === "play" ? "Playground" : "OpenAPI"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-1">
          {endpoints.map((e, i) => (
            <button key={i} onClick={() => { setSelected(i); setResult(null); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-mono transition-colors" style={{ backgroundColor: selected === i ? "var(--surface-muted)" : "transparent", color: selected === i ? "var(--text)" : "var(--text-muted)" }}>
              <span className="truncate">{e.path}</span>
              <span className="text-xs font-bold">{e.method}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {tab === "ref" && (
            <div className="catalyst-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="rounded px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>{ep.method}</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{ep.path}</span>
                </div>
                <span className="text-xs" style={{ color: ep.auth ? "var(--warning)" : "var(--success)" }}>{ep.auth ? "🔒 Auth" : "🌐 Public"}</span>
              </div>
              <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>{ep.summary}</h3>
              <pre className="rounded-lg p-4 text-xs overflow-auto" style={{ backgroundColor: "var(--surface-muted)", color: "var(--text)" }}><code>{JSON.stringify(ep.response, null, 2)}</code></pre>
            </div>
          )}
          {tab === "play" && (
            <div className="catalyst-card p-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg p-3 font-mono text-xs" style={{ backgroundColor: "var(--surface-muted)", color: "var(--text)" }}>
                <span>https://staticflow.onrender.com{ep.path}</span>
                <button onClick={() => setResult(JSON.stringify(ep.response, null, 2))} className="catalyst-btn-primary !py-1 !px-3 text-xs"><Send className="h-3 w-3" /> Test</button>
              </div>
              {result && <pre className="rounded-lg p-4 text-xs overflow-auto" style={{ backgroundColor: "var(--surface-muted)", color: "var(--success)" }}><code>{result}</code></pre>}
            </div>
          )}
          {tab === "spec" && (
            <div className="catalyst-card p-6">
              <pre className="text-xs overflow-auto max-h-[500px]" style={{ color: "var(--text-muted)" }}>
                <code>{JSON.stringify({ openapi: "3.1.0", info: { title: "StaticFlow API", version: "1.0.0" }, paths: endpoints.reduce((a: any, e) => { a[e.path] = { [e.method.toLowerCase()]: { summary: e.summary } }; return a; }, {}) }, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
