"use client";

import { useState } from "react";
import { Settings, Save, Check, Shield, Database, Bell, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-display-sm" style={{ color: "var(--text)" }}>System Settings</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Platform-wide configuration, rate limits, and security policies.</p>
      </div>

      <div className="space-y-4">
        <div className="catalyst-card p-6 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text)" }}><Shield className="h-4 w-4" style={{ color: "var(--text-muted)" }} /> Security Policies</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Session Timeout (minutes)</label>
              <input type="number" defaultValue={60} className="catalyst-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Max Login Attempts</label>
              <input type="number" defaultValue={5} className="catalyst-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>API Rate Limit (req/min)</label>
              <input type="number" defaultValue={1000} className="catalyst-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Key Rotation Interval (days)</label>
              <input type="number" defaultValue={90} className="catalyst-input" />
            </div>
          </div>
        </div>

        <div className="catalyst-card p-6 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text)" }}><Database className="h-4 w-4" style={{ color: "var(--text-muted)" }} /> Database Configuration</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Connection Pool Size</label>
              <input type="number" defaultValue={20} className="catalyst-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Query Timeout (ms)</label>
              <input type="number" defaultValue={5000} className="catalyst-input" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="catalyst-btn-primary text-sm">
          {saved ? <><Check className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
