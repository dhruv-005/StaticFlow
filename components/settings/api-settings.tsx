"use client";

import { useState } from "react";
import { Key, Plus, Copy, Check, Terminal, Trash2 } from "lucide-react";

export function ApiSettings() {
  const [tokens, setTokens] = useState([
    { id: "pat-1", name: "StaticFlow CLI Local Auth", token: "sf_pat_9901844a2b1c88", created: "Oct 10, 2024" },
    { id: "pat-2", name: "GitHub Actions Secret Runner", token: "sf_pat_4421bc901a884e", created: "Sep 28, 2024" },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToken = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteToken = (id: string) => {
    setTokens(tokens.filter((t) => t.id !== id));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Key className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Personal Access Tokens (PATs)</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Authenticate your local terminal and CLI tools via OAuth Bearer</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Generating personal access token...")}
          className="flex items-center gap-1.5 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyber-cyan hover:bg-cyber-cyan/20 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Personal Token</span>
        </button>
      </div>

      <div className="rounded-xl border border-cyber-white/10 bg-black/80 p-4 space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyber-cyan">
          <Terminal className="h-4 w-4" />
          <span>Authenticate StaticFlow CLI in 1 Line:</span>
        </div>
        <pre className="text-cyber-white/80 overflow-x-auto no-scrollbar">
          <code>npx @staticflow/cli login --token=sf_pat_9901844a2b1c88</code>
        </pre>
      </div>

      <div className="divide-y divide-cyber-white/5 rounded-xl border border-cyber-white/10 bg-cyber-space/80 font-mono text-xs">
        {tokens.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="font-bold text-cyber-white text-sm font-sans">{t.name}</span>
              <div className="flex items-center gap-2 text-cyber-cyan text-xs">
                <span>{t.token.slice(0, 10)}••••••••••••••••</span>
                <button type="button" onClick={() => copyToken(t.id, t.token)} className="text-cyber-white/40 hover:text-cyber-white">
                  {copiedId === t.id ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-cyber-white/40 text-[11px] hidden sm:inline">Created {t.created}</span>
              <button
                type="button"
                onClick={() => deleteToken(t.id)}
                className="rounded p-1 text-cyber-white/30 hover:bg-cyber-red/10 hover:text-cyber-red"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
