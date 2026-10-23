"use client";

import { useEffect, useState } from "react";
import { Key, Copy, Check, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  status: string;
  createdAt: string;
  expiresAt: string | null;
}

export function KeyList() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchKeys = () => {
    fetch("/api/keys")
      .then((r) => r.json())
      .then((data) => setKeys(data.keys || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeKey = async (id: string) => {
    if (!confirm("Revoke this API key?")) return;
    await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
    fetchKeys();
  };

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-cyber-green/10 border-cyber-green/30 text-cyber-green",
    REVOKED: "bg-cyber-red/10 border-cyber-red/30 text-cyber-red",
    EXPIRED: "bg-cyber-white/5 border-cyber-white/10 text-cyber-white/40",
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <Key className="h-4 w-4 text-cyber-cyan" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          API Keys ({keys.length})
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-cyber-white/5" />
          ))}
        </div>
      ) : keys.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No API keys yet. Generate one above.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-cyber-white/5 rounded-xl border border-cyber-white/10 bg-cyber-space/80 font-mono text-xs">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between p-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyber-white text-sm font-sans truncate">
                    {k.name}
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.2 text-[9px] font-bold ${statusColor[k.status] || statusColor.ACTIVE}`}
                  >
                    {k.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-cyber-cyan text-xs">
                  <span className="truncate">
                    {k.key.slice(0, 12)}••••••••••••
                  </span>
                  <button
                    type="button"
                    onClick={() => copyKey(k.id, k.key)}
                    className="text-cyber-white/40 hover:text-cyber-white shrink-0"
                  >
                    {copiedId === k.id ? (
                      <Check className="h-3 w-3 text-cyber-green" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-cyber-white/40 text-[11px] hidden sm:inline">
                  {new Date(k.createdAt).toLocaleDateString()}
                </span>
                {k.status === "ACTIVE" && (
                  <button
                    type="button"
                    onClick={() => revokeKey(k.id)}
                    className="rounded p-1 text-cyber-white/30 hover:bg-cyber-red/10 hover:text-cyber-red"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
