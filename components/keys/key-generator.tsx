"use client";

import { useState } from "react";
import { useKeysStore } from "@/stores/keys-store";
import { generateApiKey, generateId } from "@/lib/utils";
import {
  Key,
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  Lock,
} from "lucide-react";

export function KeyGenerator({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addApiKey } = useKeysStore();

  const [keyName, setKeyName] = useState("");
  const [environment, setEnvironment] = useState<"live" | "test">("live");
  const [expirationDays, setExpirationDays] = useState<number>(90);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "read:endpoints",
    "write:endpoints",
  ]);

  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scopesList = [
    { id: "read:endpoints", label: "Read Endpoints (GET)" },
    { id: "write:endpoints", label: "Write Endpoints (POST/PUT)" },
    { id: "delete:endpoints", label: "Delete Endpoints (DELETE)" },
    { id: "admin:all", label: "Full Admin Privileges" },
  ];

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleGenerate = () => {
    if (!keyName.trim()) return;

    const prefix = environment === "live" ? "sf_live_" : "sf_test_";
    const rawKey = prefix + generateApiKey().replace("sf_", "");

    setGeneratedKey(rawKey);

    addApiKey({
      id: generateId("key"),
      projectId: "default-project",
      userId: "usr-current",
      keyName,
      keyPrefix: rawKey.slice(0, 12) + "...",
      apiKeyMasked: rawKey.slice(0, 8) + "************************" + rawKey.slice(-4),
      permissions: selectedScopes,
      ipWhitelist: [],
      expiresAt: new Date(Date.now() + expirationDays * 86400000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
    });
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setGeneratedKey(null);
    setKeyName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-cyber-white/10 bg-cyber-navy/95 p-6 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {!generatedKey ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30">
                <Key className="h-5 w-5 text-cyber-cyan" />
              </div>
              <div>
                <h3 className="text-base font-bold text-cyber-white">Create Cryptographic API Key</h3>
                <p className="text-xs text-cyber-white/40 font-mono">Scoped authentication token for external clients</p>
              </div>
            </div>

            {/* Key Name Input */}
            <div>
              <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">Key Identifier Name</label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Mobile App Backend Client"
                className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 px-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/50"
              />
            </div>

            {/* Environment Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEnvironment("live")}
                className={`rounded-xl border p-3 text-left transition-all ${
                  environment === "live"
                    ? "border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan"
                    : "border-cyber-white/5 bg-cyber-white/[0.02] text-cyber-white/40"
                }`}
              >
                <span className="text-xs font-bold block">Production (Live)</span>
                <span className="text-[10px] font-mono opacity-60">Prefix: sf_live_</span>
              </button>

              <button
                type="button"
                onClick={() => setEnvironment("test")}
                className={`rounded-xl border p-3 text-left transition-all ${
                  environment === "test"
                    ? "border-cyber-yellow/40 bg-cyber-yellow/10 text-cyber-yellow"
                    : "border-cyber-white/5 bg-cyber-white/[0.02] text-cyber-white/40"
                }`}
              >
                <span className="text-xs font-bold block">Staging / Sandbox</span>
                <span className="text-[10px] font-mono opacity-60">Prefix: sf_test_</span>
              </button>
            </div>

            {/* Expiration Settings */}
            <div>
              <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">Expiration Policy</label>
              <select
                value={expirationDays}
                onChange={(e) => setExpirationDays(Number(e.target.value))}
                className="w-full rounded-xl border border-cyber-white/10 bg-cyber-navy px-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none"
              >
                <option value={30}>30 Days (Recommended)</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days (Quarterly)</option>
                <option value={365}>1 Year</option>
                <option value={0}>Never Expire</option>
              </select>
            </div>

            {/* Scope Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">Permission Scopes</label>
              <div className="space-y-1.5">
                {scopesList.map((scope) => (
                  <label
                    key={scope.id}
                    className="flex items-center gap-2.5 rounded-lg border border-cyber-white/5 bg-cyber-white/[0.02] p-2 text-xs font-mono text-cyber-white/80 cursor-pointer hover:border-cyber-cyan/30"
                  >
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope.id)}
                      onChange={() => handleToggleScope(scope.id)}
                      className="accent-cyber-cyan"
                    />
                    <span>{scope.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Action */}
            <button
              onClick={handleGenerate}
              disabled={!keyName.trim()}
              className="neon-button w-full text-xs font-bold uppercase tracking-wider disabled:opacity-40"
            >
              Generate Token
            </button>
          </div>
        ) : (
          /* Success Revealed Key Screen */
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyber-green/10 border border-cyber-green/30 shadow-[0_0_20px_rgba(0,255,136,0.2)]">
              <ShieldCheck className="h-6 w-6 text-cyber-green" />
            </div>

            <div>
              <h3 className="text-base font-bold text-cyber-white">API Key Generated Successfully</h3>
              <p className="mt-1 text-xs text-cyber-white/40">
                Please copy this key and store it securely. You will not be able to view it again.
              </p>
            </div>

            {/* Key Copy Container */}
            <div className="rounded-xl border border-cyber-cyan/40 bg-cyber-space p-3 text-left font-mono text-xs flex items-center justify-between">
              <span className="text-cyber-cyan font-bold truncate mr-2">{generatedKey}</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 shrink-0 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 px-2.5 py-1 text-[11px] text-cyber-cyan hover:bg-cyber-cyan/20"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-cyber-green" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="rounded-xl border border-cyber-yellow/20 bg-cyber-yellow/5 p-3 text-left flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-cyber-yellow shrink-0 mt-0.5" />
              <p className="text-[11px] text-cyber-yellow/80 leading-relaxed font-mono">
                Never commit API keys to version control (Git) or expose them in client-side browser bundles.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 py-2.5 text-xs font-semibold text-cyber-white hover:bg-cyber-white/10 transition-all"
            >
              I have stored my key safely
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
