"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Save, Server, Shield, Activity, Mail, Globe, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Platform Settings"
        description="Configure system-wide settings and limits."
        actions={
          <button onClick={handleSave} className="btn-primary btn-sm">
            <Save size={14} /> {saved ? "Saved ✓" : "Save All"}
          </button>
        }
      />

      {/* API Configuration */}
      <div className="card-static space-y-5">
        <h3 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Server size={16} className="text-crimson" /> API Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Base URL</label>
            <input className="input font-mono text-xs" defaultValue="https://api.staticflow.app" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">API Version</label>
            <input className="input" defaultValue="v1" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Default Rate Limit (req/min)</label>
            <input className="input" type="number" defaultValue="100" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Max Request Size (MB)</label>
            <input className="input" type="number" defaultValue="10" />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card-static space-y-5">
        <h3 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Shield size={16} className="text-crimson" /> Security
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">JWT Expiry (hours)</label>
            <input className="input" type="number" defaultValue="24" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Password Min Length</label>
            <input className="input" type="number" defaultValue="8" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Max Login Attempts</label>
            <input className="input" type="number" defaultValue="5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Lockout Duration (min)</label>
            <input className="input" type="number" defaultValue="30" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          {[
            { label: "Require email verification", desc: "New users must verify their email before accessing the platform", default: true },
            { label: "Enable two-factor authentication", desc: "Allow users to enable 2FA on their accounts", default: false },
            { label: "Enforce strong passwords", desc: "Require uppercase, lowercase, number, and symbol", default: true },
            { label: "Log all API requests", desc: "Store full request/response logs for auditing", default: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <div>
                <p className="text-sm text-[var(--text-primary)]">{item.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                <div className="w-9 h-5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-pill peer-checked:bg-crimson peer-checked:border-crimson transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Limits */}
      <div className="card-static space-y-5">
        <h3 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Activity size={16} className="text-crimson" /> Usage Limits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Free Plan Requests/mo</label>
            <input className="input" type="number" defaultValue="1000" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Pro Plan Requests/mo</label>
            <input className="input" type="number" defaultValue="100000" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Max Projects (Free)</label>
            <input className="input" type="number" defaultValue="3" />
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="card-static space-y-5">
        <h3 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Mail size={16} className="text-crimson" /> Email Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">SMTP Host</label>
            <input className="input font-mono text-xs" defaultValue="smtp.resend.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">SMTP Port</label>
            <input className="input" type="number" defaultValue="587" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">From Name</label>
            <input className="input" defaultValue="StaticFlow" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">From Email</label>
            <input className="input" defaultValue="noreply@staticflow.app" />
          </div>
        </div>
        <button className="btn-secondary btn-sm"><Mail size={14} /> Send Test Email</button>
      </div>

      {/* System */}
      <div className="card-static space-y-5">
        <h3 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Globe size={16} className="text-crimson" /> System
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Maintenance Mode</label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-pill peer-checked:bg-crimson peer-checked:border-crimson transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
              <span className="text-sm text-[var(--text-muted)]">Disabled</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Registration</label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-pill peer-checked:bg-crimson peer-checked:border-crimson transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
              <span className="text-sm text-[var(--text-muted)]">Open</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button className="btn-secondary btn-sm"><RefreshCw size={14} /> Clear Cache</button>
          <button className="btn-secondary btn-sm"><RefreshCw size={14} /> Restart Workers</button>
        </div>
      </div>
    </div>
  );
}
