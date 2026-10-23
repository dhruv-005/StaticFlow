"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyber-white/10 bg-cyber-white/5 text-cyber-white/60 hover:text-cyber-white hover:bg-cyber-white/10 transition-all"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyber-pink text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-cyber-white/10 bg-cyber-navy/95 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-cyber-white/10 px-4 py-3">
            <span className="text-xs font-bold text-cyber-white font-mono">
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-mono text-cyber-cyan hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-cyber-white/5">
            {loading ? (
              <div className="p-6 text-center text-xs text-cyber-white/30 font-mono">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-cyber-white/30 font-mono">
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 ${!n.read ? "bg-cyber-cyan/[0.03]" : ""}`}
                >
                  <p className="text-xs font-bold text-cyber-white font-sans">
                    {n.title}
                  </p>
                  <p className="text-[11px] text-cyber-white/40 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-cyber-white/20 font-mono mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
