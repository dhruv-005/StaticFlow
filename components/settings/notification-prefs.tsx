"use client";

import { useState } from "react";
import { Bell, ShieldAlert, Rocket, Key, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function NotificationPrefs() {
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [deployWebhooks, setDeployWebhooks] = useState(true);
  const [keyRotationReminders, setKeyRotationReminders] = useState(true);
  const [teamInvites, setTeamInvites] = useState(true);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Bell className="h-5 w-5 text-cyber-pink" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">
              Notification &amp; Alert Routing
            </h3>
            <p className="text-xs text-cyber-white/40 font-mono">
              Preferences stored locally in your browser only
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            title: "Critical Security Vulnerabilities",
            desc: "Instant notification if automated scans detect High/Critical flaws.",
            icon: ShieldAlert,
            color: "text-cyber-red",
            state: securityAlerts,
            toggle: setSecurityAlerts,
          },
          {
            title: "Production Deployment Status",
            desc: "Notifications upon successful builds or build failure timeouts.",
            icon: Rocket,
            color: "text-cyber-green",
            state: deployWebhooks,
            toggle: setDeployWebhooks,
          },
          {
            title: "API Key Expiry & Rotation Notices",
            desc: "Advance notice 7 days prior to token expiration.",
            icon: Key,
            color: "text-cyber-cyan",
            state: keyRotationReminders,
            toggle: setKeyRotationReminders,
          },
          {
            title: "Team Invitations & Access Changes",
            desc: "Receive notifications when collaborators are added or removed.",
            icon: Users,
            color: "text-cyber-purple",
            state: teamInvites,
            toggle: setTeamInvites,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyber-white/5 border border-cyber-white/10">
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-cyber-white">
                  {item.title}
                </p>
                <p className="text-xs text-cyber-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
            <Switch checked={item.state} onCheckedChange={item.toggle} />
          </div>
        ))}
      </div>
    </div>
  );
}
