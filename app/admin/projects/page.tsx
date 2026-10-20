"use client";

import { FolderKanban, Search, Filter } from "lucide-react";

const projects = [
  { name: "E-Commerce API", owner: "Sarah Chen", lang: "Node.js", status: "Deployed", endpoints: 34, score: 95, updated: "2h ago" },
  { name: "Blog Platform", owner: "Marcus Johnson", lang: "Python", status: "Deployed", endpoints: 24, score: 90, updated: "1d ago" },
  { name: "Healthcare Records", owner: "Priya Patel", lang: "Java", status: "Active", endpoints: 18, score: 85, updated: "3d ago" },
  { name: "Chat Service", owner: "Alex Rivera", lang: "Go", status: "Draft", endpoints: 12, score: 0, updated: "5d ago" },
  { name: "AI RAG Pipeline", owner: "Elena Volkov", lang: "Python", status: "Deployed", endpoints: 8, score: 92, updated: "12h ago" },
];

const statusColors: Record<string, string> = {
  Deployed: "var(--success)",
  Active: "var(--info)",
  Draft: "var(--text-muted)",
};

export default function AdminProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-display-sm" style={{ color: "var(--text)" }}>Project Oversight</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Monitor all user-generated API projects across the platform.</p>
      </div>

      <div className="catalyst-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--surface-muted)" }}>
                {["Project", "Owner", "Stack", "Status", "Endpoints", "Security", "Updated"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {projects.map((p) => (
                <tr key={p.name} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{p.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{p.owner}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.lang}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: statusColors[p.status] }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColors[p.status] }} />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.endpoints}</td>
                  <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color: p.score >= 90 ? "var(--success)" : p.score > 0 ? "var(--warning)" : "var(--text-muted)" }}>
                    {p.score > 0 ? `${p.score}/100` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
