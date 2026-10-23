"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, Save, Check, Loader2 } from "lucide-react";

export function ProfileForm() {
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="glass-card p-6">
        <div className="h-48 animate-pulse rounded-xl bg-cyber-white/5" />
      </div>
    );
  }

  const initials = (name || email)
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <form onSubmit={handleSave} className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <User className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">
              Developer Identity
            </h3>
            <p className="text-xs text-cyber-white/40 font-mono">
              Public details displayed across audit trails
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyber-cyan/10 border-2 border-cyber-cyan/30 text-xl font-bold font-mono text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          {initials}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-white/30" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-white/30" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2.5 text-xs font-mono text-cyber-white/40 outline-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-cyber-white/10 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="neon-button flex items-center gap-2 text-xs font-bold uppercase tracking-wider disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <Check className="h-3.5 w-3.5 text-cyber-green" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span>
            {saving ? "Saving…" : saved ? "Changes Saved" : "Save Profile"}
          </span>
        </button>
      </div>
    </form>
  );
}
