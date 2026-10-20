"use client";

import { Activity, ShieldCheck, Rocket, Key, UserCheck, Code2, Clock } from "lucide-react";

interface AuditEvent {
  id: string;
  user: string;
  action: string;
  target: string;
  category: "deploy" | "security" | "auth" | "builder";
  timestamp: string;
}

export function ActivityFeed() {
  const events: AuditEvent[] = [
    {
      id: "ev-1",
      user: "Sarah Chen",
      action: "Triggered cloud deployment to Vercel",
      target: "E-Commerce API (v1.4.2)",
      category: "deploy",
      timestamp: "12 minutes ago",
    },
    {
      id: "ev-2",
      user: "Alex Vance",
      action: "Rotated production master API secret",
      target: "Primary Production Cluster",
      category: "auth",
      timestamp: "45 minutes ago",
    },
    {
      id: "ev-3",
      user: "Priya Patel",
      action: "Executed deep OWASP Top 10 security audit",
      target: "Blog Platform Service",
      category: "security",
      timestamp: "2 hours ago",
    },
    {
      id: "ev-4",
      user: "Marcus Johnson",
      action: "Generated 6 new REST endpoints via AI Prompt",
      target: "Stripe Checkout Webhook Service",
      category: "builder",
      timestamp: "4 hours ago",
    },
    {
      id: "ev-5",
      user: "Alex Vance",
      action: "Invited new organization collaborator",
      target: "david.audit@company.com (Viewer)",
      category: "auth",
      timestamp: "1 day ago",
    },
  ];

  const categoryIcons = {
    deploy: { icon: Rocket, color: "text-cyber-green bg-cyber-green/10 border-cyber-green/30" },
    security: { icon: ShieldCheck, color: "text-cyber-purple bg-cyber-purple/10 border-cyber-purple/30" },
    auth: { icon: Key, color: "text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30" },
    builder: { icon: Code2, color: "text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30" },
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Organization Audit Trail</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Immutable audit logging for compliance and governance</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {events.map((ev) => {
          const cfg = categoryIcons[ev.category];
          const Icon = cfg.icon;

          return (
            <div
              key={ev.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 hover:border-cyber-cyan/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${cfg.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-cyber-white">
                    <span className="font-bold text-cyber-cyan">{ev.user}</span>{" "}
                    <span className="text-cyber-white/80">{ev.action}</span>
                  </p>
                  <p className="text-[11px] text-cyber-white/40 font-sans">{ev.target}</p>
                </div>
              </div>

              <span className="text-[11px] text-cyber-white/30 shrink-0 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> {ev.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
