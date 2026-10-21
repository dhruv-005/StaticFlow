"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

type Tab = "profile" | "billing" | "notifications" | "danger";

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.ok ? r.json() : null)
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "profile", label: "Profile", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
    { id: "billing", label: "Usage", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
    { id: "notifications", label: "Notifications", icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" },
    { id: "danger", label: "Danger Zone", icon: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" },
  ];

  const s = stats?.stats;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-[clamp(1.3rem,3vw,1.75rem)] font-bold text-[var(--text)]">Settings</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Manage your account and workspace preferences.</p>
      </div>

      <div className="flex gap-1.5 border-b border-[var(--border)] pb-3 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              tab === t.id
                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                : t.id === "danger"
                ? "text-red-400 hover:bg-red-500/10"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-[var(--text)]">Developer Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--muted)] cursor-not-allowed"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Role</label>
              <input
                type="text"
                defaultValue={user?.role || "USER"}
                disabled
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--muted)] cursor-not-allowed"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-all"
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                Saved
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      )}

      {tab === "billing" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text)]">Current Plan: Free</h3>
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-lg border border-[var(--border)] p-3">
              <p className="text-[var(--muted)]">Projects</p>
              <p className="text-lg font-bold text-[var(--text)]">{s?.totalProjects ?? 0} / 3</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] p-3">
              <p className="text-[var(--muted)]">API Calls</p>
              <p className="text-lg font-bold text-[var(--text)]">{s?.totalCalls ?? 0} / 1,000</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] p-3">
              <p className="text-[var(--muted)]">API Keys</p>
              <p className="text-lg font-bold text-[var(--text)]">{s?.activeKeys ?? 0} / 10</p>
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text)]">Notification Preferences</h3>
          {["Security vulnerability alerts", "Deployment status updates", "API key expiry warnings", "Team activity notifications"].map((n) => (
            <div key={n} className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3">
              <span className="text-sm text-[var(--text)]">{n}</span>
              <div className="h-5 w-9 rounded-full cursor-pointer bg-[var(--accent)] relative">
                <div className="h-4 w-4 rounded-full bg-white shadow-sm absolute top-0.5 right-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "danger" && (
        <div className="space-y-4">
          {["Purge All Projects", "Close Account"].map((action) => (
            <div key={action} className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <h4 className="text-sm font-semibold text-red-400">{action}</h4>
              <p className="mt-1 text-xs text-[var(--muted)]">This action is irreversible.</p>
              <button className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors">
                {action}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
