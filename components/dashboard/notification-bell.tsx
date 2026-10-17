"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, X, Shield, Rocket, AlertTriangle, Zap } from "lucide-react";

const notifications = [
  {
    id: "1",
    icon: Shield,
    color: "text-cyber-green",
    title: "Security scan complete",
    message: "E-Commerce API scored A+ (95/100)",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: Rocket,
    color: "text-cyber-cyan",
    title: "Deployment successful",
    message: "Blog API deployed to Vercel",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    icon: AlertTriangle,
    color: "text-cyber-yellow",
    title: "Performance warning",
    message: "Healthcare API response time > 200ms",
    time: "3h ago",
    unread: false,
  },
  {
    id: "4",
    icon: Zap,
    color: "text-cyber-purple",
    title: "New feature available",
    message: "Voice-to-API is now in beta",
    time: "1d ago",
    unread: false,
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-white transition-all"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyber-cyan text-[9px] font-bold text-cyber-space">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-cyber-white/10 bg-cyber-navy/95 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyber-white/5 px-4 py-3">
              <h3 className="text-sm font-bold text-cyber-white">
                Notifications
              </h3>
              <button className="text-xs text-cyber-cyan hover:underline">
                Mark all read
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto no-scrollbar">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 transition-all hover:bg-cyber-white/[0.02] ${
                    n.unread ? "bg-cyber-cyan/[0.02]" : ""
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${n.color}`}>
                    <n.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-cyber-white">
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-cyber-white/40 truncate">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px] text-cyber-white/20">
                      {n.time}
                    </p>
                  </div>
                  {n.unread && (
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyber-cyan" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-cyber-white/5 px-4 py-2.5 text-center">
              <button className="text-xs text-cyber-cyan hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
