"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Plus, Search, FolderKanban, Grid3X3, List,
  MoreHorizontal, Clock, ArrowRight,
} from "lucide-react";

const demoProjects = [
  { name: "Task Manager API", desc: "REST API with auth, CRUD, and PostgreSQL", endpoints: 8, status: "Deployed", updated: "2 hours ago" },
  { name: "E-commerce Backend", desc: "Product catalog, cart, and checkout API", endpoints: 14, status: "Draft", updated: "1 day ago" },
  { name: "Blog Platform API", desc: "Posts, comments, and user management", endpoints: 6, status: "Testing", updated: "3 days ago" },
];

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = demoProjects.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    Deployed: "bg-green-500/10 text-green-500",
    Draft: "bg-[var(--bg-elevated)] text-[var(--text-muted)]",
    Testing: "bg-yellow-500/10 text-yellow-500",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Projects"
        description="Manage and organize your API projects."
        actions={
          <Link href="/app/builder" className="btn-primary btn-sm">
            <Plus size={14} /> New Project
          </Link>
        }
      />

      {/* Search + View toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-crimson text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-crimson text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Projects */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={28} />}
          title="No projects found"
          description="Create your first API project and let AI generate the backend for you."
          action={{ label: "Create Project", href: "/app/builder" }}
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.name} className="card group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-crimson-soft text-crimson flex items-center justify-center">
                  <FolderKanban size={18} />
                </div>
                <span className={`badge text-[10px] ${statusColor[p.status] || ""}`}>{p.status}</span>
              </div>
              <h3 className="font-display font-semibold text-[var(--text-primary)] mb-1 group-hover:text-crimson transition-colors">
                {p.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{p.desc}</p>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{p.endpoints} endpoints</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {p.updated}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.name} className="card-static flex items-center gap-4 p-4 group cursor-pointer hover:border-crimson transition-colors">
              <div className="w-9 h-9 rounded-lg bg-crimson-soft text-crimson flex items-center justify-center shrink-0">
                <FolderKanban size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--text-primary)] group-hover:text-crimson transition-colors truncate">{p.name}</h3>
                <p className="text-xs text-[var(--text-muted)] truncate">{p.desc}</p>
              </div>
              <span className={`badge text-[10px] hidden sm:inline-flex ${statusColor[p.status] || ""}`}>{p.status}</span>
              <span className="text-xs text-[var(--text-muted)] hidden md:block">{p.endpoints} endpoints</span>
              <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-crimson transition-colors shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
