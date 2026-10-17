"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Code2, Shield, Activity, FileText,
  Rocket, Key, ShoppingBag, Users, Settings, Menu, X,
  Search, Bell, HelpCircle, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CatalystLogo } from "@/components/shared/catalyst-logo";

const nav = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/builder", label: "API Builder", icon: Code2 },
  { href: "/security", label: "Security", icon: Shield },
  { href: "/performance", label: "Performance", icon: Activity },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/docs", label: "Documentation", icon: FileText },
  { href: "/deploy", label: "Deploy", icon: Rocket },
  { href: "/keys", label: "Key Vault", icon: Key },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/overview" ? pathname === "/overview" : pathname.startsWith(href);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-200 lg:static ${
          collapsed ? "w-[68px]" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex h-14 items-center justify-between px-4" style={{ borderBottom: "1px solid var(--border)" }}>
          {!collapsed && <CatalystLogo href="/overview" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md"
            style={{ color: "var(--text-muted)" }}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden" style={{ color: "var(--text-muted)" }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 no-scrollbar">
          <div className="space-y-0.5">
            {nav.map((item) => {
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
          <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-muted)]" style={{ color: "var(--text-muted)" }}>
            <Shield className="h-4 w-4" />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-muted)]" style={{ color: "var(--text-muted)" }}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex h-14 shrink-0 items-center justify-between px-4 lg:px-6"
          style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden" style={{ color: "var(--text)" }}>
              <Menu className="h-5 w-5" />
            </button>
            <div
              className="hidden items-center gap-2 rounded-lg px-3 py-2 sm:flex"
              style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border)" }}
            >
              <Search className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>Search...</span>
              <kbd className="ml-6 rounded px-1.5 py-0.5 text-[10px] font-mono" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-muted)]" style={{ color: "var(--text-muted)" }}>
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-muted)]" style={{ color: "var(--text-muted)" }}>
              <HelpCircle className="h-4 w-4" />
            </button>
            <div className="mx-1 h-6 w-px" style={{ backgroundColor: "var(--border)" }} />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>JD</div>
              <span className="hidden text-sm font-medium sm:block" style={{ color: "var(--text)" }}>Jane</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
