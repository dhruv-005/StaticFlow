"use client";

import { useAuth } from "@/lib/auth-context";

export default function TeamPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-[clamp(1.3rem,3vw,1.75rem)] font-bold text-[var(--text)]">Team</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          Manage organization members and role-based access.
        </p>
      </div>

      {/* Current user */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">Current Members</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-sm font-bold text-[var(--accent)] shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)]">{user?.name || "User"} (You)</p>
              <p className="text-xs text-[var(--muted)]">{user?.email}</p>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
              {user?.role || "USER"}
            </span>
          </div>
        </div>
      </div>

      {/* Coming soon */}
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--border)]/50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[var(--text)] mb-1">Team collaboration coming soon</h3>
        <p className="text-sm text-[var(--muted)] max-w-sm mx-auto">
          Invite team members, assign roles, and collaborate on API projects. This feature is under development.
        </p>
      </div>
    </div>
  );
}
