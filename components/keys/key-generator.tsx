"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

export function KeyGenerator({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      setName("");
      onCreated?.();
    } catch {
      setError("Failed to create key. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      className="glass-card p-5 border-cyber-cyan/20 space-y-3"
    >
      <h4 className="text-xs font-bold text-cyber-white font-mono uppercase tracking-wider">
        Generate New API Key
      </h4>
      <div className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key name (e.g. Production Backend)"
          className="flex-1 rounded-xl border border-cyber-white/10 bg-cyber-white/5 px-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="neon-button flex items-center gap-2 text-xs font-bold uppercase tracking-wider disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Create
        </button>
      </div>
      {error && (
        <p className="text-xs font-mono text-cyber-red">{error}</p>
      )}
    </form>
  );
}
