"use client";

import { Shield, Check, X } from "lucide-react";

interface PermissionRule {
  capability: string;
  admin: boolean;
  developer: boolean;
  tester: boolean;
  viewer: boolean;
}

export function RoleManager() {
  const permissions: PermissionRule[] = [
    { capability: "Generate API Code from Prompt", admin: true, developer: true, tester: false, viewer: false },
    { capability: "Modify Code in Monaco Editor", admin: true, developer: true, tester: false, viewer: false },
    { capability: "Trigger OWASP Security Scans", admin: true, developer: true, tester: true, viewer: false },
    { capability: "Execute Load & Stress Benchmarks", admin: true, developer: true, tester: true, viewer: false },
    { capability: "Deploy to Production Clouds", admin: true, developer: true, tester: false, viewer: false },
    { capability: "Manage Secrets & API Key Vault", admin: true, developer: false, tester: false, viewer: false },
    { capability: "Invite & Manage Team Seats", admin: true, developer: false, tester: false, viewer: false },
    { capability: "View Live Telemetry & Logs", admin: true, developer: true, tester: true, viewer: true },
    { capability: "Inspect OpenAPI Docs & Sandbox", admin: true, developer: true, tester: true, viewer: true },
  ];

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Shield className="h-5 w-5 text-cyber-purple" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">RBAC Capability Matrix</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Enforced across web dashboards, CLI tools, and automation webhooks</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-cyber-white/10 bg-cyber-space/80">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-cyber-white/10 bg-cyber-white/[0.02] text-cyber-white/60">
              <th className="p-4">CAPABILITY / PERMISSION</th>
              <th className="p-4 text-center text-cyber-red font-bold">ADMIN</th>
              <th className="p-4 text-center text-cyber-cyan font-bold">DEVELOPER</th>
              <th className="p-4 text-center text-cyber-purple font-bold">TESTER</th>
              <th className="p-4 text-center text-cyber-white/40 font-bold">VIEWER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-white/5">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-cyber-white/[0.01] transition-all">
                <td className="p-4 text-cyber-white/90 font-sans text-xs">{p.capability}</td>
                <td className="p-4 text-center">
                  {p.admin ? <Check className="h-4 w-4 text-cyber-green mx-auto" /> : <X className="h-4 w-4 text-cyber-white/20 mx-auto" />}
                </td>
                <td className="p-4 text-center">
                  {p.developer ? <Check className="h-4 w-4 text-cyber-green mx-auto" /> : <X className="h-4 w-4 text-cyber-white/20 mx-auto" />}
                </td>
                <td className="p-4 text-center">
                  {p.tester ? <Check className="h-4 w-4 text-cyber-green mx-auto" /> : <X className="h-4 w-4 text-cyber-white/20 mx-auto" />}
                </td>
                <td className="p-4 text-center">
                  {p.viewer ? <Check className="h-4 w-4 text-cyber-green mx-auto" /> : <X className="h-4 w-4 text-cyber-white/20 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
