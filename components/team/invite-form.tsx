"use client";

import { useState } from "react";
import { TeamRole } from "@/types/team";
import { UserPlus, X, Mail, Shield, Check, Send } from "lucide-react";

export function InviteForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("developer");
  const [projectScope, setProjectScope] = useState("all");
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-cyber-white/10 bg-cyber-navy/95 p-6 shadow-2xl backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-cyber-white">Invite Team Collaborator</h3>
                <p className="text-xs text-cyber-white/40 font-mono">Send an encrypted invite with RBAC permissions</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-mono text-cyber-white/50">Colleague Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-mono text-cyber-white/50">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as TeamRole)}
                  className="w-full rounded-xl border border-cyber-white/10 bg-cyber-navy px-3 py-2 text-xs font-mono text-cyber-white outline-none"
                >
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                  <option value="tester">Tester</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-mono text-cyber-white/50">Project Access</label>
                <select
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  className="w-full rounded-xl border border-cyber-white/10 bg-cyber-navy px-3 py-2 text-xs font-mono text-cyber-white outline-none"
                >
                  <option value="all">All Organization APIs</option>
                  <option value="ecom">E-Commerce API Only</option>
                  <option value="blog">Blog Service Only</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="neon-button flex items-center justify-center gap-2 w-full text-xs font-bold uppercase tracking-wider mt-4"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Invitation Email</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3 py-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-cyber-white">Invitation Sent!</h3>
            <p className="text-xs text-cyber-white/50 font-mono">
              An activation link has been delivered to <span className="text-cyber-cyan">{email}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
