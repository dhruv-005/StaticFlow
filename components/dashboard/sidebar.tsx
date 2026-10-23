"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  FolderCode,
  Key,
  Shield,
  Activity,
  Settings,
  Users,
  Rocket,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderCode },
  { href: "/keys", label: "API Keys", icon: Key },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/deploy", label: "Deploy", icon: Rocket },
  { href: "/security", label: "Security", icon: Shield },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const initials = user
    ? (user.name || user.email)
        .split(/[\s@]+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-cyber-white/10 bg-cyber-navy/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 border-b border-cyber-white/10 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
          <Zap className="h-4 w-4" />
        </div>
        <span className="text-base font-bold tracking-tight text-cyber-white">
          StaticFlow
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                active
                  ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20"
                  : "text-cyber-white/50 hover:text-cyber-white hover:bg-cyber-white/5 border border-transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cyber-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-xs font-bold font-mono text-cyber-purple">
            {loading ? "…" : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-cyber-white truncate font-sans">
              {loading ? "Loading…" : user?.name || "User"}
            </p>
            <p className="text-[10px] font-mono text-cyber-white/40 truncate">
              {user?.role || "USER"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-3 py-2 text-xs font-semibold text-cyber-white/50 hover:text-cyber-red hover:border-cyber-red/30 hover:bg-cyber-red/5 transition-all"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
