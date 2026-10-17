"use client";

import { useState } from "react";
import { TeamMember, TeamRole } from "@/types/team";
import {
  Users,
  Shield,
  Trash2,
  Mail,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Lock,
} from "lucide-react";

export function MemberList({ onOpenInvite }: { onOpenInvite: () => void }) {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "mem-1",
      userId: "usr-1",
      name: "Alex Vance (You)",
      email: "alex@staticflow.dev",
      avatarUrl: "",
      role: "admin",
      joinedAt: "2024-01-15",
    },
    {
      id: "mem-2",
      userId: "usr-2",
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      avatarUrl: "",
      role: "developer",
      joinedAt: "2024-03-10",
    },
    {
      id: "mem-3",
      userId: "usr-3",
      name: "Marcus Johnson",
      email: "marcus.j@company.com",
      avatarUrl: "",
      role: "developer",
      joinedAt: "2024-05-22",
    },
    {
      id: "mem-4",
      userId: "usr-4",
      name: "Priya Patel",
      email: "priya.qa@company.com",
      avatarUrl: "",
      role: "tester",
      joinedAt: "2024-07-01",
    },
    {
      id: "mem-5",
      userId: "usr-5",
      name: "David Kim",
      email: "david.audit@company.com",
      avatarUrl: "",
      role: "viewer",
      joinedAt: "2024-08-14",
    },
  ]);

  const roleStyles: Record<TeamRole, string> = {
    admin: "bg-cyber-red/10 border-cyber-red/30 text-cyber-red",
    developer: "bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan",
    tester: "bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple",
    viewer: "bg-cyber-white/5 border-cyber-white/10 text-cyber-white/60",
  };

  const handleRoleChange = (id: string, newRole: TeamRole) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
  };

  const handleRemoveMember = (id: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/10 p-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cyber-cyan" />
          <h3 className="text-sm font-bold text-cyber-white">Active Members ({members.length})</h3>
        </div>
      </div>

      {/* Members List */}
      <div className="divide-y divide-cyber-white/5 font-mono text-xs">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-cyber-white/[0.01] transition-all"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-sm font-bold text-cyber-cyan font-sans">
                {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyber-white font-sans text-sm">{member.name}</span>
                  <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase ${roleStyles[member.role]}`}>
                    {member.role}
                  </span>
                </div>
                <p className="text-cyber-white/40 text-xs flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3 w-3" /> {member.email}
                </p>
              </div>
            </div>

            {/* Meta & Role Selector */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block text-[11px] text-cyber-white/30">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Joined {member.joinedAt}
                </span>
              </div>

              {/* Role Select Dropdown */}
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.id, e.target.value as TeamRole)}
                disabled={member.id === "mem-1"}
                className="rounded-lg border border-cyber-white/10 bg-cyber-navy px-2.5 py-1.5 text-xs font-mono text-cyber-white outline-none cursor-pointer disabled:opacity-40"
              >
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
                <option value="viewer">Viewer</option>
              </select>

              {/* Remove Action */}
              {member.id !== "mem-1" && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="rounded-lg p-2 text-cyber-white/30 hover:bg-cyber-red/10 hover:text-cyber-red transition-all"
                  title="Remove Member"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
