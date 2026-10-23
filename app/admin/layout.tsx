"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2, LayoutDashboard, Users, ScrollText,
  Settings, ArrowLeft, Crown,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/admin/logs", label: "Audit Logs", icon: <ScrollText size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 h-14 border-b border-[var(--border)] bg-[var(--bg-surface)]/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/app/dashboard" className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors" title="Back to app">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-7 h-7 rounded-lg bg-crimson flex items-center justify-center shadow-glow-sm">
            <Crown size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-[var(--text-primary)]">
            Admin<span className="text-crimson">Panel</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-crimson-soft text-crimson text-[10px] hidden sm:inline-flex">Super Admin</span>
          <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center text-crimson text-xs font-bold">A</div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-[var(--border)] bg-[var(--sidebar-bg)] min-h-[calc(100vh-3.5rem)] p-3">
          <nav className="space-y-0.5">
            {adminNav.map((item) => {
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden w-full border-b border-[var(--border)] bg-[var(--sidebar-bg)] p-2 flex gap-1 overflow-x-auto">
          {adminNav.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link shrink-0 ${isActive ? "active" : ""}`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
