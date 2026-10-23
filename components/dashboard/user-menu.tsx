"use client";

import { useAuth } from "@/lib/auth-context";
import { User, Settings, LogOut } from "lucide-react";

export function UserMenu() {
  const { user, loading, logout } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-cyber-white/10 bg-cyber-white/5 px-3 py-2">
        <div className="h-7 w-7 animate-pulse rounded-full bg-cyber-white/10" />
        <div className="h-3 w-16 animate-pulse rounded bg-cyber-white/10" />
      </div>
    );
  }

  const initials = (user.name || user.email)
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-cyber-white/10 bg-cyber-white/5 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-xs font-bold font-mono text-cyber-cyan">
        {initials}
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-bold text-cyber-white font-sans">
          {user.name || "User"}
        </p>
        <p className="text-[10px] font-mono text-cyber-white/40">
          {user.email}
        </p>
      </div>
      <div className="flex items-center gap-1 ml-2">
        <button
          type="button"
          className="rounded p-1.5 text-cyber-white/40 hover:text-cyber-white hover:bg-cyber-white/5 transition-all"
          title="Settings"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={logout}
          className="rounded p-1.5 text-cyber-white/40 hover:text-cyber-red hover:bg-cyber-red/10 transition-all"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
