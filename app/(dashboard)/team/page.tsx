"use client";

import { UserPlus } from "lucide-react";

const members = [
  { name: "Jane Doe (You)", email: "jane@company.com", role: "Admin", joined: "Jan 2024" },
  { name: "Sarah Chen", email: "sarah@company.com", role: "Developer", joined: "Mar 2024" },
  { name: "Marcus Johnson", email: "marcus@company.com", role: "Developer", joined: "May 2024" },
  { name: "Priya Patel", email: "priya@company.com", role: "Tester", joined: "Jul 2024" },
];

const roleColor: Record<string, string> = { Admin: "var(--danger)", Developer: "var(--info)", Tester: "var(--warning)", Viewer: "var(--text-muted)" };

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Team</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Manage organization members and role-based access.</p>
        </div>
        <button className="catalyst-btn-primary text-xs"><UserPlus className="h-3.5 w-3.5" /> Invite Member</button>
      </div>

      <div className="catalyst-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="catalyst-table">
            <thead><tr><th>Member</th><th className="hidden sm:table-cell">Role</th><th className="hidden md:table-cell">Joined</th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.email}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: "var(--surface-muted)", color: "var(--text)" }}>{m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                      <div><p className="font-medium" style={{ color: "var(--text)" }}>{m.name}</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.email}</p></div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell"><span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--surface-muted)", color: roleColor[m.role] }}>{m.role}</span></td>
                  <td className="hidden md:table-cell text-xs" style={{ color: "var(--text-muted)" }}>{m.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
