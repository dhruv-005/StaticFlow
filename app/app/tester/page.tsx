"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MethodBadge } from "@/components/ui/badge";
import { Play, Save, Clock, Copy, Download, Trash2 } from "lucide-react";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const history = [
  { method: "GET", url: "/api/tasks", status: 200, time: "42ms", when: "2 min ago" },
  { method: "POST", url: "/api/auth/login", status: 200, time: "128ms", when: "5 min ago" },
  { method: "POST", url: "/api/tasks", status: 201, time: "67ms", when: "1 hr ago" },
  { method: "DELETE", url: "/api/tasks/3", status: 204, time: "31ms", when: "2 hr ago" },
];

export default function TesterPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.example.com/api/tasks");
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body" | "auth">("params");
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setResponse(JSON.stringify({
        data: [
          { id: 1, title: "Build API", status: "done", priority: "high" },
          { id: 2, title: "Write tests", status: "pending", priority: "medium" },
        ],
        total: 2,
        limit: 10,
        offset: 0,
      }, null, 2));
      setSending(false);
    }, 1000);
  };

  const statusColor = (code: number) => {
    if (code >= 200 && code < 300) return "text-green-500";
    if (code >= 300 && code < 400) return "text-yellow-500";
    if (code >= 400 && code < 500) return "text-orange-500";
    return "text-red-500";
  };

  const tabs = [
    { key: "params" as const, label: "Params" },
    { key: "headers" as const, label: "Headers" },
    { key: "body" as const, label: "Body" },
    { key: "auth" as const, label: "Auth" },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader title="API Tester" description="Send HTTP requests and inspect responses." />

      {/* Request Builder */}
      <div className="card-static p-4 space-y-4">
        {/* URL Bar */}
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="input w-28 font-mono font-bold text-sm shrink-0"
          >
            {methods.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input font-mono text-sm flex-1"
            placeholder="https://api.example.com/endpoint"
          />
          <button onClick={handleSend} disabled={sending} className="btn-primary shrink-0">
            {sending ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Play size={16} />
            )}
            Send
          </button>
          <button className="btn-secondary shrink-0 hidden sm:flex"><Save size={16} /></button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-crimson text-crimson"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[80px]">
          {activeTab === "params" && (
            <div className="text-sm text-[var(--text-muted)] py-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-elevated)]">
                <input className="input flex-1 text-xs" placeholder="Key" />
                <input className="input flex-1 text-xs" placeholder="Value" />
              </div>
            </div>
          )}
          {activeTab === "headers" && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-elevated)]">
              <input className="input flex-1 text-xs" defaultValue="Content-Type" />
              <input className="input flex-1 text-xs" defaultValue="application/json" />
            </div>
          )}
          {activeTab === "body" && (
            <textarea className="input font-mono text-xs min-h-[80px]" placeholder='{"key": "value"}' />
          )}
          {activeTab === "auth" && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-elevated)]">
              <select className="input w-32 text-xs"><option>Bearer Token</option><option>API Key</option><option>None</option></select>
              <input className="input flex-1 text-xs" placeholder="Enter token..." />
            </div>
          )}
        </div>
      </div>

      {/* Response */}
      {response && (
        <div className="card-static p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-green-500">200 OK</span>
              <span className="text-xs text-[var(--text-muted)]">42ms</span>
              <span className="text-xs text-[var(--text-muted)]">1.2 KB</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-crimson hover:bg-crimson-soft transition-colors"><Copy size={14} /></button>
              <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-crimson hover:bg-crimson-soft transition-colors"><Download size={14} /></button>
            </div>
          </div>
          <pre className="rounded-xl bg-[var(--code-bg)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text-primary)] overflow-x-auto max-h-64 overflow-y-auto">
            {response}
          </pre>
        </div>
      )}

      {/* History */}
      <div className="card-static">
        <h3 className="font-display font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
          <Clock size={14} className="text-[var(--text-muted)]" /> Request History
        </h3>
        <div className="space-y-1">
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer">
              <MethodBadge method={h.method} />
              <span className="font-mono text-xs text-[var(--text-primary)] flex-1 truncate">{h.url}</span>
              <span className={`font-mono text-xs font-bold ${statusColor(h.status)}`}>{h.status}</span>
              <span className="text-xs text-[var(--text-muted)] hidden sm:block">{h.time}</span>
              <span className="text-xs text-[var(--text-muted)] hidden md:block">{h.when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
