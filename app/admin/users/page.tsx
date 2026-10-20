"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count?: { projects: number; apiKeys: number };
}

type RoleFilter = "ALL" | "USER" | "ADMIN";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* pagination */
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;

  /* filters */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  /* edit role modal */
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<"USER" | "ADMIN">("USER");
  const [saving, setSaving] = useState(false);

  /* delete modal */
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(perPage),
      });
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter !== "ALL") params.set("role", roleFilter);

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      } else {
        setError("Failed to load users.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const handleRoleChange = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setEditUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update role.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete user.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
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
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {(["ALL", "USER", "ADMIN"] as RoleFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRoleFilter(r);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                roleFilter === r
                  ? "bg-[var(--accent)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50"
              }`}
            >
              {r === "ALL" ? "All" : r}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 break-words">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">
            dismiss
          </button>
        </div>
      )}

      {/* Table (desktop) */}
      <div className="hidden md:block rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Projects
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Keys
                </th>
                <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Joined
                </th>
                <th className="text-right text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="animate-pulse space-y-2 mx-auto w-48">
                      <div className="h-4 rounded bg-[var(--border)]" />
                      <div className="h-4 rounded bg-[var(--border)] w-32 mx-auto" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-[var(--muted)]"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[var(--border)]/50 hover:bg-[var(--border)]/20 transition-colors"
                  >
                    <td className="px-4 py-3 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text)] truncate">
                            {u.name}
                          </p>
                          <p className="text-xs text-[var(--muted)] truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === "ADMIN"
                            ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text)] tabular-nums">
                      {u._count?.projects ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text)] tabular-nums">
                      {u._count?.apiKeys ?? 0}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditUser(u);
                            setNewRole(u.role);
                          }}
                          className="p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                          aria-label="Edit role"
                          title="Edit role"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeleteUser(u)}
                            className="p-1.5 rounded-md text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label="Delete user"
                            title="Delete user"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
            No users found
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-sm font-bold text-[var(--accent)] shrink-0">
                  {u.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {u.email}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    u.role === "ADMIN"
                      ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {u.role}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                <span>{u._count?.projects ?? 0} projects</span>
                <span>{u._count?.apiKeys ?? 0} keys</span>
                <span>{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 pt-1 border-t border-[var(--border)]">
                <button
                  onClick={() => {
                    setEditUser(u);
                    setNewRole(u.role);
                  }}
                  className="flex-1 rounded-lg border border-[var(--border)] py-2 text-xs font-medium text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors"
                >
                  Edit Role
                </button>
                {u.id !== currentUser?.id && (
                  <button
                    onClick={() => setDeleteUser(u)}
                    className="flex-1 rounded-lg border border-red-500/30 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
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
            {total}
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

      {/* ── Edit Role Modal ── */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditUser(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-[var(--text)] mb-1">
              Change Role
            </h2>
            <p className="text-sm text-[var(--muted)] mb-4 break-words">
              Update role for{" "}
              <span className="text-[var(--text)] font-medium">
                {editUser.name}
              </span>
            </p>
            <div className="flex gap-2 mb-6">
              {(["USER", "ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setNewRole(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    newRole === r
                      ? r === "ADMIN"
                        ? "bg-[var(--accent)] text-[var(--bg)]"
                        : "bg-blue-500 text-white"
                      : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                disabled={saving || newRole === editUser.role}
                className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-all disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete User Modal ── */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteUser(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-[var(--text)] mb-2">
              Delete user?
            </h2>
            <p className="text-sm text-[var(--muted)] mb-6 break-words">
              Permanently delete{" "}
              <span className="text-[var(--text)] font-medium">
                {deleteUser.name}
              </span>{" "}
              ({deleteUser.email}) and all their data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteUser(null)}
                className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
