"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Bell, CheckCheck, Rocket, AlertTriangle, KeyRound, Activity, Circle } from "lucide-react";

const notifications = [
  { id: 1, type: "deploy", title: "Deployment successful", desc: "v1.2.0 deployed to production", time: "2 hours ago", read: false, icon: <Rocket size={16} className="text-green-500" /> },
  { id: 2, type: "error", title: "High error rate detected", desc: "POST /api/auth/login has 5.2% error rate", time: "4 hours ago", read: false, icon: <AlertTriangle size={16} className="text-crimson" /> },
  { id: 3, type: "key", title: "API key rotated", desc: "Production key was rotated by admin", time: "1 day ago", read: true, icon: <KeyRound size={16} className="text-yellow-500" /> },
  { id: 4, type: "usage", title: "Usage limit warning", desc: "You've used 85% of your monthly API quota", time: "2 days ago", read: true, icon: <Activity size={16} className="text-blue-400" /> },
  { id: 5, type: "deploy", title: "Deployment failed", desc: "v1.1.9 build failed — check logs", time: "3 days ago", read: true, icon: <Rocket size={16} className="text-crimson" /> },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems(items.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: number) =>
    setItems(items.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        description={`${unread} unread notification${unread !== 1 ? "s" : ""}`}
        actions={
          unread > 0 ? (
            <button onClick={markAllRead} className="btn-secondary btn-sm">
              <CheckCheck size={14} /> Mark all read
            </button>
          ) : null
        }
      />

      <div className="space-y-2">
        {items.map((n) => (
          <div
            key={n.id}
            onClick={() => toggleRead(n.id)}
            className={`card-static flex items-start gap-4 p-4 cursor-pointer transition-colors ${
              !n.read ? "border-crimson/30 bg-crimson-muted" : ""
            } hover:border-crimson`}
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={`text-sm ${!n.read ? "font-semibold text-[var(--text-primary)]" : "font-medium text-[var(--text-secondary)]"}`}>
                  {n.title}
                </h4>
                {!n.read && <Circle size={6} className="text-crimson fill-crimson shrink-0" />}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.desc}</p>
            </div>
            <span className="text-xs text-[var(--text-muted)] shrink-0 whitespace-nowrap">{n.time}</span>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card-static text-center py-16">
          <Bell size={28} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No notifications</p>
        </div>
      )}
    </div>
  );
}
