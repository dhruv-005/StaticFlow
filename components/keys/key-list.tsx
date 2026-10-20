"use client";

import { useState } from "react";
import { useKeysStore } from "@/stores/keys-store";
import {
  Key,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function KeyList({ onOpenGenerator }: { onOpenGenerator: () => void }) {
  const { apiKeys, removeApiKey } = useKeysStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fallbackKeys = [
    {
      id: "key-1",
      projectId: "default",
      userId: "u1",
      keyName: "Primary Production Cluster",
      keyPrefix: "sf_live_89a1...",
      apiKeyMasked: "sf_live_89a1************************901a",
      permissions: ["read:endpoints", "write:endpoints", "admin:all"],
      ipWhitelist: ["192.168.1.1/24"],
      expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      isActive: true,
      lastUsedAt: "2 minutes ago",
      createdAt: new Date().toISOString(),
    },
    {
      id: "key-2",
      projectId: "default",
      userId: "u1",
      keyName: "CI/CD Deployment Runner",
      keyPrefix: "sf_live_44c2...",
      apiKeyMasked: "sf_live_44c2************************11bc",
      permissions: ["write:endpoints"],
      ipWhitelist: [],
      expiresAt: new Date(Date.now() + 180 * 86400000).toISOString(),
      isActive: true,
      lastUsedAt: "1 hour ago",
      createdAt: new Date().toISOString(),
    },
  ];

  const keysToRender = apiKeys.length > 0 ? apiKeys : fallbackKeys;

  const copyPrefix = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/10 p-5">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-cyber-cyan" />
          <h3 className="text-sm font-bold text-cyber-white">Active Access Tokens ({keysToRender.length})</h3>
        </div>
      </div>

      {/* Table List */}
      <div className="divide-y divide-cyber-white/5 font-mono text-xs">
        {keysToRender.map((key) => (
          <div
            key={key.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-cyber-white/[0.01] transition-all"
          >
            {/* Key Information */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-cyber-white text-sm font-sans">{key.keyName}</span>
                <span className="flex items-center gap-1 rounded bg-cyber-green/10 border border-cyber-green/30 px-2 py-0.2 text-[10px] text-cyber-green">
                  <CheckCircle2 className="h-2.5 w-2.5" /> ACTIVE
                </span>
              </div>

              {/* Masked Key */}
              <div className="flex items-center gap-2 text-cyber-cyan">
                <span className="text-xs">{key.apiKeyMasked}</span>
                <button
                  onClick={() => copyPrefix(key.id, key.apiKeyMasked)}
                  className="text-cyber-white/30 hover:text-cyber-white"
                  title="Copy Token Representation"
                >
                  {copiedId === key.id ? (
                    <Check className="h-3 w-3 text-cyber-green" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              {/* Scopes & Last Active */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-cyber-white/40">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-cyber-purple" /> {key.permissions.join(", ")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cyber-white/30" /> Last used: {key.lastUsedAt || "Never"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Initiating manual zero-downtime rotation for ${key.keyName}...`)}
                className="flex items-center gap-1 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-2.5 py-1.5 text-xs text-cyber-white/70 hover:bg-cyber-white/10 hover:text-cyber-white transition-all"
              >
                <RefreshCw className="h-3 w-3 text-cyber-purple" />
                <span>Rotate</span>
              </button>

              <button
                onClick={() => removeApiKey(key.id)}
                className="flex items-center gap-1 rounded-lg border border-cyber-red/30 bg-cyber-red/10 px-2.5 py-1.5 text-xs text-cyber-red hover:bg-cyber-red/20 transition-all"
              >
                <Trash2 className="h-3 w-3" />
                <span>Revoke</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
