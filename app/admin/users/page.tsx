"use client";

import { useState } from "react";
import { Users, Search, UserPlus, MoreHorizontal, Shield, Ban, CheckCircle2 } from "lucide-react";

const allUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah@company.com", role: "Admin", plan: "Enterprise", status: "Active", joined: "Jan 15, 2024", apis: 24 },
  { id: "2", name: "Marcus Johnson", email: "marcus@startup.io", role: "Developer", plan: "Pro", status: "Active", joined: "Mar 10, 2024", apis: 12 },
  { id: "3", name: "Priya Patel", email: "priya@health.co", role: "Developer", plan: "Pro", status: "Active", joined: "May 22, 2024", apis: 8 },
  { id: "4", name: "Alex Rivera", email: "alex@freelance.dev", role: "User", plan: "Free", status: "Active", joined: "Jul 1, 2024", apis: 3 },
  { id: "5", name: "David Kim", email: "david@corp.com", role: "Viewer", plan: "Pro", status: "Suspended", joined: "Aug 14, 2024", apis: 0 },
  { id: "6", name: "Elena Volkov", email: "elena@scale.io", role: "Developer", plan: "Enterprise", status: "Active", joined: "Sep 5, 2024", apis: 18 },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-sm" style={{ color: "var(--text)" }}>User Management</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{allUsers.length} registered users across all plans.</p>
        </div>
        <button className="catalyst-btn-primary text-xs"><UserPlus className="h-3.5 w-3.5" /> Invite User</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="catalyst-input !pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="catalyst-input !w-auto"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Developer">Developer</option>
          <option value="User">User</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="catalyst-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--surface-muted)" }}>
                {["User", "Role", "Plan", "APIs", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: "var(--surface-muted)", color: "var(--text)" }}>
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "var(--text)" }}>{u.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text)" }}>
                      <Shield className="h-3 w-3" style={{ color: "var(--text-muted)" }} /> {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{u.plan}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{u.apis}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: u.status === "Active" ? "var(--success)" : "var(--danger)" }}>
                      {u.status === "Active" ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{u.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded p-1 hover:bg-[var(--surface-muted)]" style={{ color: "var(--text-muted)" }}>
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            No users match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
