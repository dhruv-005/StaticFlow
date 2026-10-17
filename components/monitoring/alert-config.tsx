"use client";

import { useState } from "react";
import { Bell, Slack, Mail, MessageSquare, Plus, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function AlertConfig() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [discordAlerts, setDiscordAlerts] = useState(false);

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Bell className="h-5 w-5 text-cyber-pink" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Threshold Alert Rules &amp; Webhooks</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Automated notifications on latency spikes or downtime</p>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-pink/10 text-cyber-pink">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-cyber-white">Email Urgent Alerts</p>
              <p className="text-xs text-cyber-white/40">Sent to devops@company.com upon downtime &gt; 1 minute</p>
            </div>
          </div>
          <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-purple/10 text-cyber-purple">
              <Slack className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-cyber-white">Slack Webhook (#api-incidents)</p>
              <p className="text-xs text-cyber-white/40">Instant incident tickets when 5xx error rate exceeds 1%</p>
            </div>
          </div>
          <Switch checked={slackAlerts} onCheckedChange={setSlackAlerts} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-cyber-white">Discord Incident Bot</p>
              <p className="text-xs text-cyber-white/40">Dispatch real-time webhooks to engineering channels</p>
            </div>
          </div>
          <Switch checked={discordAlerts} onCheckedChange={setDiscordAlerts} />
        </div>
      </div>
    </div>
  );
}
