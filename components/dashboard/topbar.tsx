"use client";

import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { NotificationBell } from "./notification-bell";
import { UserMenu } from "./user-menu";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function Topbar({ onMenuClick, sidebarCollapsed }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-cyber-white/5 bg-cyber-space/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
            document.dispatchEvent(event);
          }}
          className="flex items-center gap-2 rounded-lg border border-cyber-white/10 bg-cyber-white/[0.03]
                     px-3 py-2 text-sm text-cyber-white/30 transition-all hover:border-cyber-white/20
                     hover:bg-cyber-white/5 w-48 sm:w-64 lg:w-80"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search anything...</span>
          <kbd className="ml-auto hidden rounded border border-cyber-white/10 bg-cyber-white/5 px-1.5 py-0.5 text-[10px] font-mono text-cyber-white/30 sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-white transition-all"
          title="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-cyber-white/10" />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
