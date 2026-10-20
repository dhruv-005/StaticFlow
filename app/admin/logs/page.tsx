"use client";

import { useEffect, useState, useCallback } from "react";

interface LogEntry {
  id: string;
  action: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

type ActionFilter = "ALL" | "LOGIN" | "REGISTER" | "GENERATE" | "DELETE" | "ROLE_CHANGE";

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-500/20 text-green-400",
  REGISTER: "bg-blue-500/20 text-blue-400",
  GENERATE: "bg-[var(--accent)]/20 text-[var(--accent)]",
  DELETE: "bg-red-500/20 text-red-400",
  ROLE_CHANGE: "bg-purple-500/20 text-purple-400",
  LOGOUT: "bg-yellow-500/20 text-yellow-400",
  API_CALL: "bg-cyan-500/20 text-cyan-400",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 25;

  const [actionFilter, setActionFilter] = useState<ActionFilter>("ALL");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(perPage),
      });
      if (actionFilter !== "ALL") params.set("action", actionFilter);

      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      } else {
        setError("Failed to load audit logs.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[var(--text)]">Audit Logs</h2>
          <p className="text-xs text-[var(--muted)]">
            {total.toLocaleString()} total events recorded
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors w-fit disabled:opacity-50"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={loading ? "animate-spin" : ""}
          >
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(["ALL", "LOGIN", "REGISTER", "GENERATE", "DELETE", "ROLE_CHANGE"] as ActionFilter[]).map(
          (a) => (
            <button
              key={a}
              onClick={() => {
                setActionFilter(a);
                setPage(1);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap ${
                actionFilter === a
                  ? "bg-[var(--accent)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50"
              }`}
            >
              {a === "ALL" ? "All Events" : a.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 break-words">
          {error}
        </div>
      )}

      {/* Table (desktop) */}
      <div className="hidden md:block rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3 w-36">
                  Time
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3 w-32">
                  Action
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Details
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3 w-32">
                  IP
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="animate-pulse space-y-2 mx-auto w-48">
                      <div className="h-4 rounded bg-[var(--border)]" />
                      <div className="h-4 rounded bg-[var(--border)] w-32 mx-auto" />
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-[var(--muted)]">
                    No log entries found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--border)]/50 hover:bg-[var(--border)]/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[var(--muted)] whitespace-nowrap tabular-nums">
                      {formatTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 min-w-0">
                      {log.user ? (
                        <div className="min-w-0">
                          <p className="text-sm text-[var(--text)] truncate">
                            {log.user.name}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] truncate">
                            {log.user.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--muted)] italic">
                          System
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                          ACTION_COLORS[log.action] ||
                          "bg-[var(--border)] text-[var(--muted)]"
                        }`}
                      >
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] break-words max-w-[300px]">
                      {log.details || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] font-mono whitespace-nowrap">
                      {log.ipAddress || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden space-y-2">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
            No log entries found
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    ACTION_COLORS[log.action] ||
                    "bg-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {log.action.replace("_", " ")}
                </span>
                <span className="text-[10px] text-[var(--muted)] tabular-nums shrink-0">
                  {formatTime(log.createdAt)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--text)] truncate">
                  {log.user?.name || "System"}
                </p>
                {log.details && (
                  <p className="text-[11px] text-[var(--muted)] break-words line-clamp-2 mt-0.5">
                    {log.details}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--muted)] tabular-nums shrink-0">
            {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} of{" "}
            {total.toLocaleString()}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-xs text-[var(--muted)] tabular-nums">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
