"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MethodBadge } from "@/components/ui/badge";
import { Search, Filter, Copy, ExternalLink, Plus } from "lucide-react";

const endpoints = [
  { method: "POST", path: "/api/auth/register", desc: "Register a new user", auth: false, status: "201", tested: "2 min ago" },
  { method: "POST", path: "/api/auth/login", desc: "Authenticate and get JWT token", auth: false, status: "200", tested: "5 min ago" },
  { method: "GET", path: "/api/auth/me", desc: "Get current user profile", auth: true, status: "200", tested: "1 hr ago" },
  { method: "GET", path: "/api/tasks", desc: "List all tasks for authenticated user", auth: true, status: "200", tested: "3 hr ago" },
  { method: "POST", path: "/api/tasks", desc: "Create a new task", auth: true, status: "201", tested: "1 day ago" },
  { method: "GET", path: "/api/tasks/:id", desc: "Get a single task by ID", auth: true, status: "200", tested: "1 day ago" },
  { method: "PUT", path: "/api/tasks/:id", desc: "Update an existing task", auth: true, status: "200", tested: "2 days ago" },
  { method: "DELETE", path: "/api/tasks/:id", desc: "Delete a task", auth: true, status: "204", tested: "2 days ago" },
];

export default function EndpointsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const methods = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

  const filtered = endpoints.filter((e) => {
    const matchSearch = e.path.toLowerCase().includes(search.toLowerCase()) || e.desc.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === "ALL" || e.method === methodFilter;
    return matchSearch && matchMethod;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Endpoints"
        description="Manage and inspect all API endpoints."
        actions={
          <button className="btn-primary btn-sm"><Plus size={14} /> Add Endpoint</button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search endpoints..."
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-0.5 overflow-x-auto">
          {methods.map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                methodFilter === m
                  ? "bg-crimson text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoint Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Endpoint</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Auth</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Last Tested</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ep, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="px-4 py-3"><MethodBadge method={ep.method} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{ep.path}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{ep.desc}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {ep.auth ? (
                      <span className="badge bg-yellow-500/10 text-yellow-500 text-[10px]">Required</span>
                    ) : (
                      <span className="badge bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[10px]">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden sm:table-cell">{ep.tested}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-crimson hover:bg-crimson-soft transition-colors" title="Copy path">
                        <Copy size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-crimson hover:bg-crimson-soft transition-colors" title="Open in tester">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-[var(--text-muted)]">
            No endpoints match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
