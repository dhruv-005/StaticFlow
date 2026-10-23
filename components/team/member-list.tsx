"use client";

import { useAuth } from "@/lib/auth-context";
import { Users, Mail } from "lucide-react";

export function MemberList({ onOpenInvite }: { onOpenInvite?: () => void }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="h-24 animate-pulse rounded-xl bg-cyber-white/5" />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-cyber-white/10 p-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cyber-cyan" />
          <h3 className="text-sm font-bold text-cyber-white">
            Active Members
          </h3>
        </div>
      </div>

      <div className="divide-y divide-cyber-white/5 font-mono text-xs">
        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-sm font-bold text-cyber-cyan font-sans">
                {(user.name || user.email)
                  .split(/[\s@]+/)
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyber-white font-sans text-sm">
                    {user.name || "User"} (You)
                  </span>
                  <span className="rounded border border-cyber-red/30 bg-cyber-red/10 px-1.5 py-0.2 text-[9px] font-bold uppercase text-cyber-red">
                    {user.role}
                  </span>
                </div>
                <p className="text-cyber-white/40 text-xs flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-cyber-white/30">
            Not signed in.
          </div>
        )}
      </div>

      <div className="border-t border-cyber-white/10 p-4">
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          Team management with multiple members is coming soon.
        </p>
      </div>
    </div>
  );
}
