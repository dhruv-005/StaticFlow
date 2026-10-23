"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, FileCode } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ActivityFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs")
      .then((r) => r.json())
      .then((data) => setLogs(data.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">
              Audit Trail
            </h3>
            <p className="text-xs text-cyber-white/40 font-mono">
              Recent account activity from server logs
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-cyber-white/5"
            />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No audit log entries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3 font-mono text-xs">
          {logs.slice(0, 20).map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 hover:border-cyber-cyan/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
                  <FileCode className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-cyber-white">
                    <span className="font-bold text-cyber-cyan">
                      {log.action}
                    </span>
                  </p>
                  {log.details && (
                    <p className="text-[11px] text-cyber-white/40 font-sans">
                      {log.details}
                    </p>
                  )}
                  {log.ipAddress && (
                    <p className="text-[10px] text-cyber-white/20">
                      IP: {log.ipAddress}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[11px] text-cyber-white/30 shrink-0 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> {timeAgo(log.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
