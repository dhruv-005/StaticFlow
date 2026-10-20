"use client";

import { useEffect, useState } from "react";

interface Setting {
  key: string;
  value: string;
  updatedAt: string;
}

const DEFAULT_SETTINGS: Record<string, { label: string; desc: string; type: "text" | "number" | "boolean" }> = {
  platform_name: { label: "Platform Name", desc: "Display name across the app", type: "text" },
  max_projects_per_user: { label: "Max Projects / User", desc: "Limit per user account", type: "number" },
  max_keys_per_user: { label: "Max API Keys / User", desc: "Active keys allowed", type: "number" },
  rate_limit_per_minute: { label: "Rate Limit (req/min)", desc: "Per API key throttle", type: "number" },
  maintenance_mode: { label: "Maintenance Mode", desc: "Block all API generation", type: "boolean" },
  registration_enabled: { label: "Open Registration", desc: "Allow new user signups", type: "boolean" },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data: Setting[] = await res.json();
          const map: Record<string, string> = {};
          data.forEach((s) => {
            map[s.key] = s.value;
          });
          setSettings(map);
        }
      } catch {
        /* use defaults */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getValue = (key: string, fallback: string) =>
    settings[key] ?? fallback;

  const setValue = (key: string, val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSuccess("Settings saved successfully.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save settings.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-base font-bold text-[var(--text)]">
          Platform Settings
        </h2>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Configure global platform behavior
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 break-words">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400 break-words">
          {success}
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(DEFAULT_SETTINGS).map(([key, meta]) => (
          <div
            key={key}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`setting-${key}`}
                  className="text-sm font-semibold text-[var(--text)] block"
                >
                  {meta.label}
                </label>
                <p className="text-xs text-[var(--muted)] mt-0.5 break-words">
                  {meta.desc}
                </p>
              </div>

              <div className="shrink-0 sm:w-48">
                {meta.type === "boolean" ? (
                  <button
                    id={`setting-${key}`}
                    onClick={() =>
                      setValue(
                        key,
                        getValue(key, "false") === "true" ? "false" : "true"
                      )
                    }
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      getValue(key, "false") === "true"
                        ? "bg-[var(--accent)]"
                        : "bg-[var(--border)]"
                    }`}
                    role="switch"
                    aria-checked={getValue(key, "false") === "true"}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        getValue(key, "false") === "true"
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                ) : (
                  <input
                    id={`setting-${key}`}
                    type={meta.type === "number" ? "number" : "text"}
                    value={getValue(
                      key,
                      meta.type === "number" ? "10" : "StaticFlow"
                    )}
                    onChange={(e) => setValue(key, e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                    style={{ fontSize: "16px" }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            "Save Settings"
          )}
        </button>
        <span className="text-xs text-[var(--muted)]">
          Changes apply immediately
        </span>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 sm:p-6 mt-8">
        <h3 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h3>
        <p className="text-xs text-[var(--muted)] mb-4 break-words">
          Irreversible actions that affect the entire platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            Purge All Audit Logs
          </button>
          <button className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            Reset Usage Counters
          </button>
        </div>
      </div>
    </div>
  );
}
