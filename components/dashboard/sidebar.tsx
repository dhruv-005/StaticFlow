"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Code2,
  Shield,
  BarChart3,
  Activity,
  FileText,
  Rocket,
  Key,
  ShoppingBag,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const mainNav = [
  { href: "/overview", icon: LayoutDashboard, label: "Overview" },
  { href: "/builder", icon: Code2, label: "API Builder" },
  { href: "/security", icon: Shield, label: "Security" },
  { href: "/performance", icon: BarChart3, label: "Performance" },
  { href: "/monitoring", icon: Activity, label: "Monitoring" },
  { href: "/docs", icon: FileText, label: "Documentation" },
  { href: "/deploy", icon: Rocket, label: "Deploy" },
  { href: "/keys", icon: Key, label: "Key Vault" },
];

const secondaryNav = [
  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/overview") return pathname === "/overview";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-cyber-white/5
                  bg-cyber-space/95 backdrop-blur-xl transition-all duration-300
                  lg:relative lg:z-auto
                  ${collapsed ? "w-[72px]" : "w-64"}
                  ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-cyber-white/5 px-4">
        <Link
          href="/overview"
          className="flex items-center gap-2 overflow-hidden"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
            <Zap className="h-4 w-4 text-cyber-cyan" />
          </div>
          {!collapsed && (
            <span className="text-base font-black text-cyber-white whitespace-nowrap">
              Static<span className="text-cyber-cyan">Flow</span>
            </span>
          )}
        </Link>

        {/* Mobile Close */}
        <button
          onClick={onMobileClose}
          className="rounded-lg p-1.5 text-cyber-white/40 hover:text-cyber-white lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Desktop Collapse */}
        <button
          onClick={onToggle}
          className="hidden rounded-lg p-1.5 text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-white lg:block"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        <div className="space-y-1">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20"
                      : "text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white border border-transparent"
                  }
                  ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    active
                      ? "text-cyber-cyan"
                      : "text-cyber-white/30 group-hover:text-cyber-white/60"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyber-cyan" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-cyber-white/5" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20"
                      : "text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white border border-transparent"
                  }
                  ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    active
                      ? "text-cyber-cyan"
                      : "text-cyber-white/30 group-hover:text-cyber-white/60"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-cyber-white/5 px-3 py-3 space-y-1">
        <Link
          href="/help"
          title={collapsed ? "Help" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-white/60 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <HelpCircle className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Help & Support</span>}
        </Link>
        <button
          title={collapsed ? "Log Out" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cyber-red/50 hover:bg-cyber-red/5 hover:text-cyber-red transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>

        {/* User Card */}
        {!collapsed && (
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-cyber-white/5 bg-cyber-white/[0.02] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-xs font-bold text-cyber-purple">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-cyber-white">
                John Doe
              </p>
              <p className="truncate text-xs text-cyber-white/30">
                Free Plan
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
