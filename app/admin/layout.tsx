"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Shield, Activity, FileText,
  Settings, Database, Key, Bell, LogOut, Menu, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CatalystLogo } from "@/components/shared/catalyst-logo";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users & Roles", icon: Users },
  { href: "/admin/security", label: "Security & Audit", icon: Shield },
  { href: "/admin/analytics", label: "Analytics", icon: Activity },
  { href: "/admin/infrastructure", label: "Infrastructure", icon: Database },
  { href: "/admin/api-keys", label: "API Keys", icon: Key },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/logs", label: "Audit Logs", icon: FileText },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-200 lg:static ${
          collapsed ? "w-[68px]" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex h-14 items-center justify-between px-4" style={{ borderBottom: "1px solid var(--border)" }}>
          {!collapsed && <CatalystLogo href="/admin" />}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md" style={{ color: "var(--text-muted)" }}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden" style={{ color: "var(--text-muted)" }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 no-scrollbar">
          <div className="space-y-0.5">
            {adminNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: active ? "var(--surface-muted)" : "transparent",
                    color: active ? "var(--text)" : "var(--text-muted)",
                  }}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {active && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-2" style={{ borderTop: "1px solid var(--border)" }}>
          <Link href="/overview" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-muted)]" style={{ color: "var(--text-muted)" }}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Exit Admin</span>}
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between px-4 lg:px-6" style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden" style={{ color: "var(--text)" }}>
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Admin Console</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
