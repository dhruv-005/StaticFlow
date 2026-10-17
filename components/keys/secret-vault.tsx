"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Plus, Trash2, ShieldCheck, Copy, Check } from "lucide-react";

interface VaultSecret {
  id: string;
  key: string;
  value: string;
  category: "Payment" | "Database" | "Auth" | "Third-Party";
}

export function SecretVault() {
  const [secrets, setSecrets] = useState<VaultSecret[]>([
    { id: "1", key: "STRIPE_SECRET_KEY", value: "sk_live_51Nw9910Az991823a88b", category: "Payment" },
    { id: "2", key: "DATABASE_PASSWORD", value: "psql_prod_cluster_super_pass_2024", category: "Database" },
    { id: "3", key: "JWT_SIGNING_PRIVATE_KEY", value: "-----BEGIN RSA PRIVATE KEY-----MIIEowI...", category: "Auth" },
    { id: "4", key: "OPENAI_API_KEY", value: "sk-proj-99201a884bcz0019284", category: "Third-Party" },
  ]);

  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copySecret = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeSecret = (id: string) => {
    setSecrets(secrets.filter((s) => s.id !== id));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Lock className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Protected Application Secrets</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Encrypted at rest using master KMS envelope keys</p>
          </div>
        </div>

        <button
          onClick={() => alert("Open Add Secret Modal")}
          className="flex items-center gap-1.5 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyber-cyan hover:bg-cyber-cyan/20 transition-all"
        >
          <Plus className="h-3.5 w-3.5" /> Add Secret
        </button>
      </div>

      {/* Secrets List */}
      <div className="space-y-3 font-mono text-xs">
        {secrets.map((sec) => (
          <div
            key={sec.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5"
          >
            <div className="space-y-1 min-w-[240px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyber-white">{sec.key}</span>
                <span className="rounded bg-cyber-white/5 px-1.5 py-0.2 text-[9px] text-cyber-white/40 uppercase">
                  {sec.category}
                </span>
              </div>
            </div>

            {/* Value Mask / Unmask */}
            <div className="flex-1 flex items-center justify-between bg-black/60 border border-cyber-white/5 rounded-lg px-3 py-1.5 max-w-md">
              <span className="text-cyber-cyan truncate mr-2">
                {revealed[sec.id] ? sec.value : "••••••••••••••••••••••••••••••••••••••••"}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleReveal(sec.id)}
                  className="text-cyber-white/40 hover:text-cyber-white"
                  title="Toggle Visibility"
                >
                  {revealed[sec.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => copySecret(sec.id, sec.value)}
                  className="text-cyber-white/40 hover:text-cyber-white"
                  title="Copy Secret"
                >
                  {copiedId === sec.id ? (
                    <Check className="h-3.5 w-3.5 text-cyber-green" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={() => removeSecret(sec.id)}
              className="rounded p-1.5 text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-red transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
