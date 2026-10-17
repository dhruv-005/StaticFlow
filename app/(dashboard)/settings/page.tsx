"use client";

import { useState } from "react";
import { User, CreditCard, Bell, AlertTriangle, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "billing" | "notifications" | "danger">("profile");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "billing" as const, label: "Billing", icon: CreditCard },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "danger" as const, label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Settings</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Manage your account, billing, and workspace preferences.</p>
      </div>

      <div className="flex gap-1.5 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="catalyst-btn-ghost text-xs" style={tab === t.id ? { backgroundColor: "var(--surface-muted)", color: t.id === "danger" ? "var(--danger)" : "var(--text)" } : { color: t.id === "danger" ? "var(--danger)" : "var(--text-muted)" }}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="catalyst-card p-6 space-y-5">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Developer Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Full Name</label><input type="text" defaultValue="Jane Doe" className="catalyst-input" /></div>
            <div><label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Email</label><input type="email" defaultValue="jane@company.com" className="catalyst-input" /></div>
          </div>
          <button onClick={handleSave} className="catalyst-btn-primary text-xs">{saved ? <><Check className="h-3.5 w-3.5" /> Saved</> : <><Save className="h-3.5 w-3.5" /> Save Changes</>}</button>
        </div>
      )}

      {tab === "billing" && (
        <div className="catalyst-card p-6 space-y-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Current Plan: Pro ($29/mo)</h3>
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}><p style={{ color: "var(--text-muted)" }}>Projects</p><p className="text-lg font-bold" style={{ color: "var(--text)" }}>12 / ∞</p></div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}><p style={{ color: "var(--text-muted)" }}>API Calls</p><p className="text-lg font-bold" style={{ color: "var(--text)" }}>18.4K / 100K</p></div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}><p style={{ color: "var(--text-muted)" }}>Team Seats</p><p className="text-lg font-bold" style={{ color: "var(--text)" }}>4 / 10</p></div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="catalyst-card p-6 space-y-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Notification Preferences</h3>
          {["Security vulnerability alerts", "Deployment status updates", "API key expiry warnings", "Team activity notifications"].map((n) => (
            <div key={n} className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
              <span className="text-sm" style={{ color: "var(--text)" }}>{n}</span>
              <div className="h-5 w-9 rounded-full cursor-pointer" style={{ backgroundColor: "var(--accent)" }}><div className="h-4 w-4 rounded-full bg-white shadow-sm translate-x-4 translate-y-0.5" /></div>
            </div>
          ))}
        </div>
      )}

      {tab === "danger" && (
        <div className="space-y-4">
          {["Purge All Projects", "Close Account"].map((action) => (
            <div key={action} className="rounded-xl border p-5" style={{ borderColor: "var(--danger)", backgroundColor: "rgba(198,40,40,0.04)" }}>
              <h4 className="text-sm font-semibold" style={{ color: "var(--danger)" }}>{action}</h4>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>This action is irreversible.</p>
              <button className="catalyst-btn-danger mt-3 text-xs">{action}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
