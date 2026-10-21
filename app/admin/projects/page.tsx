"use client";

import { useEffect, useState, useCallback } from "react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  endpoint: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: { apiKeys: number };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(perPage),
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/projects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setTotal(data.total || 0);
      } else {
        setError("Failed to load projects.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchProjects();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[var(--text)]">
            Project Oversight
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {total.toLocaleString()} total projects across the platform
          </p>
        </div>
        <button
          onClick={fetchProjects}
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

      {/* Search */}
      <div className="relative max-w-md">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="2"
          strokeLinecap="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects or owners…"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
          style={{ fontSize: "16px" }}
        />
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
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Project
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Owner
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Endpoint
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Keys
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Updated
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
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-[var(--muted)]">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--border)]/50 hover:bg-[var(--border)]/20 transition-colors"
                  >
                    <td className="px-4 py-3 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">
                        {p.name}
                      </p>
                      {p.description && (
                        <p className="text-[11px] text-[var(--muted)] truncate mt-0.5">
                          {p.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 min-w-0">
                      <p className="text-sm text-[var(--text)] truncate">
                        {p.user.name || "Unnamed"}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] truncate">
                        {p.user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-[var(--muted)] truncate block max-w-[200px]">
                        {p.endpoint || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text)] tabular-nums">
                      {p._count.apiKeys}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] whitespace-nowrap">
                      {timeAgo(p.updatedAt)}
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
            No projects found
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-[var(--muted)] truncate">
                    {p.user.name || "Unnamed"} · {p.user.email}
                  </p>
                </div>
                <span className="text-[10px] text-[var(--muted)] shrink-0">
                  {timeAgo(p.updatedAt)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                <span>{p._count.apiKeys} keys</span>
                {p.endpoint && (
                  <span className="font-mono truncate">{p.endpoint}</span>
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
