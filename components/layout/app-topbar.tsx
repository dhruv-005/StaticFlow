"use client";

import { Search, Bell, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppTopbarProps {
  title?: string;
  onMobileMenu?: () => void;
}

export function AppTopbar({ title, onMobileMenu }: AppTopbarProps) {
  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        {title && (
          <h1 className="text-lg font-semibold font-display text-[var(--text-primary)] tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text-muted)] w-48 lg:w-64 hover:border-crimson/30 transition-colors cursor-text">
          <Search size={14} />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:bg-crimson-soft hover:text-crimson transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-crimson" />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
