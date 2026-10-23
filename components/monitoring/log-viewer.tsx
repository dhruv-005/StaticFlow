"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

interface LogEntry {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  latency: number;
  createdAt: string;
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monitoring/stats")
      .then((r) => r.json())
      .then((data) => setLogs(data.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s: number) => {
    if (s < 300) return "text-cyber-green";
    if (s < 400) return "text-cyber-cyan";
    if (s < 500) return "text-cyber-yellow";
    return "text-cyber-red";
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <Terminal className="h-4 w-4 text-cyber-green" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Request Logs ({logs.length})
        </h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-cyber-white/5" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No request logs recorded yet.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-cyber-white/10 bg-black/80 overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-cyber-white/10 text-cyber-white/40">
                <th className="p-3 text-left">TIME</th>
                <th className="p-3 text-left">METHOD</th>
                <th className="p-3 text-left">ENDPOINT</th>
                <th className="p-3 text-left">STATUS</th>
                <th className="p-3 text-right">LATENCY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-white/5">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-cyber-white/[0.02]">
                  <td className="p-3 text-cyber-white/50">
                    {new Date(l.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="p-3 text-cyber-cyan font-bold">{l.method}</td>
                  <td className="p-3 text-cyber-white/80 truncate max-w-[200px]">
                    {l.endpoint}
                  </td>
                  <td className={`p-3 font-bold ${statusColor(l.status)}`}>
                    {l.status}
                  </td>
                  <td className="p-3 text-right text-cyber-white/60">
                    {l.latency}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
