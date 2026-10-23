"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { User, Lock, Bell, Palette, Trash2, Save, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

const tabs = [
  { key: "profile", label: "Profile", icon: <User size={16} /> },
  { key: "security", label: "Security", icon: <Lock size={16} /> },
  { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { key: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  { key: "danger", label: "Danger Zone", icon: <Trash2 size={16} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? tab.key === "danger"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-crimson-soft text-crimson"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 card-static min-w-0">

          {/* ===== PROFILE ===== */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-[var(--text-primary)]">Profile Information</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Update your personal details.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-crimson/20 flex items-center justify-center text-crimson text-xl font-bold shrink-0">
                  U
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">User</p>
                  <p className="text-sm text-[var(--text-muted)]">user@example.com</p>
                  <button className="text-xs text-crimson hover:underline mt-1">Change avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Display Name</label>
                  <input className="input" defaultValue="User" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
                  <input className="input" defaultValue="user@example.com" type="email" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Company</label>
                  <input className="input" placeholder="Your company" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Role</label>
                  <input className="input" defaultValue="Developer" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)]">Bio</label>
                <textarea className="input min-h-[80px] resize-y" placeholder="Tell us about yourself..." />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleSave} className="btn-primary btn-sm">
                  <Save size={14} /> Save Changes
                </button>
                {saved && (
                  <span className="text-sm text-green-500 animate-fade-in">✓ Saved successfully</span>
                )}
              </div>
            </div>
          )}

          {/* ===== SECURITY ===== */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-[var(--text-primary)]">Security</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your password and authentication settings.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Current Password</label>
                  <input className="input" type="password" placeholder="Enter current password" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">New Password</label>
                  <input className="input" type="password" placeholder="Min 8 characters" />
                  <p className="text-xs text-[var(--text-muted)]">Must be at least 8 characters with a number and symbol</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Confirm New Password</label>
                  <input className="input" type="password" placeholder="Repeat new password" />
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary btn-sm">
                <Lock size={14} /> Update Password
              </button>

              <div className="border-t border-[var(--border)] pt-6">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">Active Sessions</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3">Manage devices where you are currently logged in.</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)]">
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">Chrome on Linux</p>
                      <p className="text-xs text-[var(--text-muted)]">Current session · Last active now</p>
                    </div>
                    <span className="badge bg-green-500/10 text-green-500 text-[10px]">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-[var(--text-primary)]">Notification Preferences</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Choose what notifications you receive.</p>
              </div>

              <div className="space-y-1">
                {[
                  { label: "Deployment updates", desc: "Get notified when deployments succeed or fail", default: true },
                  { label: "Test failures", desc: "Alert when API tests return errors", default: true },
                  { label: "API usage warnings", desc: "Alert when approaching usage limits", default: true },
                  { label: "Security events", desc: "Key rotations, login alerts, and access changes", default: true },
                  { label: "Product updates", desc: "New features and platform announcements", default: false },
                  { label: "Marketing emails", desc: "Tips, tutorials, and community highlights", default: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-pill peer-checked:bg-crimson peer-checked:border-crimson transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>

              <button onClick={handleSave} className="btn-primary btn-sm">
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {/* ===== APPEARANCE ===== */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-[var(--text-primary)]">Appearance</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Customize how StaticFlow looks.</p>
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {[
                    { value: "light", icon: <Sun size={20} />, label: "Light" },
                    { value: "dark", icon: <Moon size={20} />, label: "Dark" },
                    { value: "system", icon: <Monitor size={20} />, label: "System" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                        theme === opt.value
                          ? "border-crimson bg-crimson-soft text-crimson shadow-glow-sm"
                          : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-crimson/50 hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {opt.icon}
                      <span className="text-xs font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Preview</p>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-crimson flex items-center justify-center">
                      <span className="text-white text-xs font-bold">SF</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">StaticFlow</p>
                      <p className="text-xs text-[var(--text-muted)]">Current theme active</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 flex-1 rounded-full bg-crimson" />
                    <div className="h-2 flex-1 rounded-full bg-[var(--border)]" />
                    <div className="h-2 flex-1 rounded-full bg-[var(--border)]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== DANGER ZONE ===== */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-red-500">Danger Zone</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Irreversible and destructive actions.</p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Export all data</p>
                    <p className="text-xs text-[var(--text-muted)]">Download a copy of all your projects, endpoints, and settings.</p>
                  </div>
                  <button className="btn-secondary btn-sm shrink-0">Export Data</button>
                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Delete all projects</p>
                    <p className="text-xs text-[var(--text-muted)]">Permanently remove all projects and their data. This cannot be undone.</p>
                  </div>
                  <button className="btn-sm bg-red-600 text-white hover:bg-red-700 rounded-lg shrink-0">Delete All</button>
                </div>

                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-red-500">Delete account</p>
                    <p className="text-xs text-[var(--text-muted)]">Permanently delete your account and all associated data. This action is irreversible.</p>
                  </div>
                  <button className="btn-sm bg-red-600 text-white hover:bg-red-700 rounded-lg shrink-0">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
