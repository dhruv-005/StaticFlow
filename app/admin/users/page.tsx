"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/badge";
import {
  Search, Plus, Filter, MoreHorizontal,
  Shield, UserX, UserCheck, Crown, Mail,
} from "lucide-react";

const users = [
  { id: 1, name: "Dhruv Patel", email: "dhruv@api.com", role: "Super Admin", status: "Active", projects: 12, lastLogin: "2 min ago", joined: "Jan 1, 2025" },
  { id: 2, name: "Vatsal Shah", email: "vatsal@api.com", role: "Super Admin", status: "Active", projects: 8, lastLogin: "1 hr ago", joined: "Jan 5, 2025" },
  { id: 3, name: "Admin User", email: "admin@api.com", role: "Super Admin", status: "Active", projects: 5, lastLogin: "3 hr ago", joined: "Jan 10, 2025" },
  { id: 4, name: "Sarah Chen", email: "sarah@dev.io", role: "User", status: "Active", projects: 3, lastLogin: "1 day ago", joined: "Feb 14, 2025" },
  { id: 5, name: "Mike Johnson", email: "mike@startup.co", role: "Admin", status: "Active", projects: 7, lastLogin: "5 hr ago", joined: "Mar 2, 2025" },
  { id: 6, name: "Emily Davis", email: "emily@tech.dev", role: "User", status: "Inactive", projects: 1, lastLogin: "30 days ago", joined: "Nov 20, 2024" },
  { id: 7, name: "Alex Kim", email: "alex@agency.io", role: "User", status: "Active", projects: 4, lastLogin: "2 days ago", joined: "Mar 15, 2025" },
  { id: 8, name: "Jordan Lee", email: "jordan@freelance.me", role: "User", status: "Suspended", projects: 0, lastLogin: "Never", joined: "Apr 1, 2025" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const roles = ["ALL", "Super Admin", "Admin", "User"];

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleBadge = (role: string) => {
    if (role === "Super Admin") return "bg-crimson-soft text-crimson";
    if (role === "Admin") return "bg-purple-500/10 text-purple-400";
    return "bg-[var(--bg-elevated)] text-[var(--text-muted)]";
  };

  const statusVariant = (status: string) => {
    if (status === "Active") return "green";
    if (status === "Inactive") return "yellow";
    if (status === "Suspended") return "red";
    return "default";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User Management"
        description={`${users.length} total users · ${users.filter((u) => u.status === "Active").length} active`}
        actions={
          <button className="btn-primary btn-sm"><Plus size={14} /> Invite User</button>
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
            placeholder="Search users by name or email..."
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-0.5 overflow-x-auto">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                roleFilter === r
                  ? "bg-crimson text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Projects</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center text-crimson text-xs font-bold shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--text-primary)] text-sm truncate">{u.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[10px] ${roleBadge(u.role)}`}>
                      {u.role === "Super Admin" && <Crown size={10} className="mr-0.5" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{u.projects}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">{u.lastLogin}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Send email">
                        <Mail size={14} />
                      </button>
                      {u.status === "Active" ? (
                        <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors" title="Suspend">
                          <UserX size={14} />
                        </button>
                      ) : (
                        <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-green-500 hover:bg-green-500/10 transition-colors" title="Activate">
                          <UserCheck size={14} />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-crimson hover:bg-crimson-soft transition-colors" title="Change role">
                        <Shield size={14} />
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
            No users match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
