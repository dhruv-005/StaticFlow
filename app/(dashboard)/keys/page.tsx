"use client";

import { useEffect, useState } from "react";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  status: string;
  createdAt: string;
  project?: { id: string; name: string } | null;
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      } else {
        setError("Failed to load API keys.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewName("");
        fetchKeys();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create key.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/keys/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchKeys();
      }
    } catch {
      setError("Failed to delete key.");
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard?.writeText(key).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskKey = (key: string) => {
    if (key.length <= 12) return key;
    return key.slice(0, 10) + "..." + key.slice(-4);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-40 rounded bg-[var(--border)]" />
        <div className="h-48 rounded-xl bg-[var(--surface)] border border-[var(--border)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.3rem,3vw,1.75rem)] font-bold text-[var(--text)]">
            API Keys
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {keys.length} key{keys.length !== 1 ? "s" : ""} — used to authenticate API requests
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-all w-fit"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Generate Key
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 break-words">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">dismiss</button>
        </div>
      )}

      {keys.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[var(--text)] mb-1">No API keys yet</h3>
          <p className="text-sm text-[var(--muted)] mb-4">Generate an API via the Builder to get your first key, or create one manually.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-all"
          >
            Create Key
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Key</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider hidden sm:table-cell">Project</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">Created</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{k.name}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCopy(k.key)}
                        className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        {copied === k.key ? "Copied!" : maskKey(k.key)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] hidden sm:table-cell">
                      {k.project?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        k.status === "ACTIVE"
                          ? "bg-green-500/15 text-green-400"
                          : k.status === "REVOKED"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)] hidden md:table-cell">
                      {new Date(k.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteId(k.id)}
                        className="p-1.5 rounded-md text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        aria-label="Revoke key"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-[var(--text)] mb-4">Create API Key</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Key name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Production, CI/CD, Mobile App"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                  style={{ fontSize: "16px" }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-all disabled:opacity-50">
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-[var(--text)] mb-2">Revoke API key?</h2>
            <p className="text-sm text-[var(--muted)] mb-6">This will permanently revoke the key. Any applications using it will stop working.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors">
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
