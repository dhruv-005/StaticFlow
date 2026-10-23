"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Code2, LayoutDashboard, FolderKanban, Zap, Link2,
  FlaskConical, Rocket, KeyRound, BarChart3, Bell,
  Settings, ChevronLeft, ChevronRight, Crown,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  admin?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { href: "/app/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { href: "/app/projects", label: "Projects", icon: <FolderKanban size={18} /> },
      { href: "/app/builder", label: "AI Builder", icon: <Zap size={18} /> },
      { href: "/app/endpoints", label: "Endpoints", icon: <Link2 size={18} /> },
      { href: "/app/tester", label: "API Tester", icon: <FlaskConical size={18} /> },
      { href: "/app/deployments", label: "Deployments", icon: <Rocket size={18} /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/app/api-keys", label: "API Keys", icon: <KeyRound size={18} /> },
      { href: "/app/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
      { href: "/app/notifications", label: "Notifications", icon: <Bell size={18} /> },
    ],
  },
  {
    title: "Preferences",
    items: [
      { href: "/app/settings", label: "Settings", icon: <Settings size={18} /> },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/admin", label: "Admin Panel", icon: <Crown size={18} />, admin: true },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col border-r border-[var(--border)]
        bg-[var(--sidebar-bg)] z-30 transition-all duration-300
        ${collapsed ? "w-[68px]" : "w-64"} hidden lg:flex`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--border)] shrink-0">
        {!collapsed && (
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-crimson flex items-center justify-center shadow-glow-sm">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-[var(--text-primary)]">
              Static<span className="text-crimson">Flow</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`sidebar-link ${isActive(item.href) ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-[var(--border)] p-3 shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center text-crimson text-xs font-bold shrink-0">
            U
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">User</p>
              <p className="text-xs text-[var(--text-muted)] truncate">Free Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
