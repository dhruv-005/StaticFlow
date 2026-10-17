"use client";

import { useState } from "react";
import { Key, Plus, Trash2, Eye, EyeOff, ShieldCheck, Save, Check } from "lucide-react";

interface EnvPair {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

export function EnvConfig() {
  const [envs, setEnvs] = useState<EnvPair[]>([
    { id: "1", key: "DATABASE_URL", value: "postgresql://staticflow:secret@db.prod:5432/main", isSecret: true },
    { id: "2", key: "JWT_SECRET", value: "sf_jwt_production_master_key_9901844", isSecret: true },
    { id: "3", key: "PORT", value: "3000", isSecret: false },
    { id: "4", key: "NODE_ENV", value: "production", isSecret: false },
  ]);

  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const toggleVisibility = (id: string) => {
    setVisibleMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addEnv = () => {
    setEnvs([
      ...envs,
      { id: Date.now().toString(), key: "", value: "", isSecret: false },
    ]);
  };

  const removeEnv = (id: string) => {
    setEnvs(envs.filter((e) => e.id !== id));
  };

  const updateEnv = (id: string, field: "key" | "value", val: string) => {
    setEnvs(envs.map((e) => (e.id === id ? { ...e, [field]: val } : e)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Key className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Encrypted Environment Variables</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Injected directly into runtime containers with AES-256-GCM encryption</p>
          </div>
        </div>

        <button
          onClick={addEnv}
          className="flex items-center gap-1.5 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyber-cyan hover:bg-cyber-cyan/20 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Variable</span>
        </button>
      </div>

      <div className="space-y-3">
        {envs.map((env) => (
          <div
            key={env.id}
            className="flex items-center gap-3 rounded-lg border border-cyber-white/10 bg-cyber-space/80 p-2.5"
          >
            <input
              type="text"
              value={env.key}
              onChange={(e) => updateEnv(env.id, "key", e.target.value)}
              placeholder="VARIABLE_NAME"
              className="flex-1 rounded border border-cyber-white/10 bg-cyber-white/5 px-3 py-1.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />

            <div className="relative flex-1">
              <input
                type={visibleMap[env.id] || !env.isSecret ? "text" : "password"}
                value={env.value}
                onChange={(e) => updateEnv(env.id, "value", e.target.value)}
                placeholder="Value..."
                className="w-full rounded border border-cyber-white/10 bg-cyber-white/5 px-3 py-1.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40 pr-8"
              />
              {env.isSecret && (
                <button
                  type="button"
                  onClick={() => toggleVisibility(env.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyber-white/40 hover:text-cyber-white"
                >
                  {visibleMap[env.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>

            <button
              onClick={() => removeEnv(env.id)}
              className="rounded p-1.5 text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-red"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-cyber-white/10 pt-4">
        <span className="flex items-center gap-1.5 text-xs font-mono text-cyber-green">
          <ShieldCheck className="h-4 w-4" /> Zero-Exposure Hardware Security Vault
        </span>

        <button
          onClick={handleSave}
          className="neon-button flex items-center gap-1.5 !px-4 !py-2 text-xs"
        >
          {saved ? <Check className="h-3.5 w-3.5 text-cyber-green" /> : <Save className="h-3.5 w-3.5" />}
          <span>{saved ? "Saved Secrets" : "Save Environment"}</span>
        </button>
      </div>
    </div>
  );
}
