"use client";

import { useState } from "react";
import { Terminal, Search, Pause, Play, Trash2, Filter } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ip: string;
}

export function LogViewer() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [isPaused, setIsPaused] = useState(false);

  const sampleLogs: LogEntry[] = [
    { id: "1", timestamp: "14:22:01.104", level: "INFO", method: "GET", path: "/api/posts", status: 200, durationMs: 24, ip: "192.168.1.1" },
    { id: "2", timestamp: "14:22:03.450", level: "INFO", method: "POST", path: "/api/auth/login", status: 200, durationMs: 48, ip: "142.250.190.46" },
    { id: "3", timestamp: "14:22:04.812", level: "WARN", method: "GET", path: "/api/users/profile", status: 401, durationMs: 12, ip: "185.199.108.153" },
    { id: "4", timestamp: "14:22:06.002", level: "INFO", method: "GET", path: "/health", status: 200, durationMs: 4, ip: "127.0.0.1" },
    { id: "5", timestamp: "14:22:08.310", level: "ERROR", method: "POST", path: "/api/checkout", status: 500, durationMs: 180, ip: "93.184.216.34" },
    { id: "6", timestamp: "14:22:11.905", level: "INFO", method: "GET", path: "/api/items?limit=20", status: 200, durationMs: 32, ip: "172.217.16.206" },
  ];

  const filteredLogs = sampleLogs.filter((log) => {
    const matchesSearch = log.path.toLowerCase().includes(search.toLowerCase()) || log.ip.includes(search);
    const matchesLevel = filterLevel === "ALL" || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const levelStyles: Record<string, string> = {
    INFO: "text-cyber-green bg-cyber-green/10 border-cyber-green/30",
    WARN: "text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30",
    ERROR: "text-cyber-red bg-cyber-red/10 border-cyber-red/30",
    DEBUG: "text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30",
  };

  return (
    <div className="glass-card flex flex-col h-[500px] overflow-hidden">
      {/* Log Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyber-white/10 bg-cyber-navy/80 p-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyber-cyan" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white">Live Ingress Stream</h4>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="flex items-center gap-1.5 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-2.5 py-1 text-xs text-cyber-white">
            <Search className="h-3.5 w-3.5 text-cyber-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter path or IP..."
              className="w-36 bg-transparent outline-none placeholder:text-cyber-white/20 text-xs"
            />
          </div>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="rounded-lg border border-cyber-white/10 bg-cyber-navy px-2 py-1 text-xs text-cyber-white font-mono outline-none"
          >
            <option value="ALL">ALL LEVELS</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-2.5 py-1 text-xs text-cyber-white/60 hover:text-cyber-white"
          >
            {isPaused ? <Play className="h-3 w-3 text-cyber-green" /> : <Pause className="h-3 w-3" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>
        </div>
      </div>

      {/* Log Body */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-1.5 bg-black/80 no-scrollbar">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-center gap-3 rounded px-2 py-1 hover:bg-cyber-white/5 transition-all text-cyber-white/80"
          >
            <span className="text-cyber-white/30 shrink-0">{log.timestamp}</span>
            <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold ${levelStyles[log.level]}`}>
              {log.level}
            </span>
            <span className="font-bold text-cyber-cyan shrink-0">{log.method}</span>
            <span className="text-cyber-white truncate flex-1">{log.path}</span>
            <span className={log.status < 400 ? "text-cyber-green" : log.status < 500 ? "text-cyber-yellow" : "text-cyber-red"}>
              {log.status}
            </span>
            <span className="text-cyber-white/40 shrink-0">{log.durationMs}ms</span>
            <span className="text-cyber-white/20 shrink-0 hidden md:inline">{log.ip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
