"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Code2,
  Shield,
  BarChart3,
  Rocket,
  FileText,
  Key,
  Settings,
  Users,
  ShoppingBag,
  Activity,
  LayoutDashboard,
  CornerDownLeft,
} from "lucide-react";

const commands = [
  { id: "overview", label: "Go to Overview", icon: LayoutDashboard, href: "/overview", category: "Navigation" },
  { id: "builder", label: "API Builder", icon: Code2, href: "/builder", category: "Navigation" },
  { id: "security", label: "Security Scanner", icon: Shield, href: "/security", category: "Navigation" },
  { id: "performance", label: "Performance Tests", icon: BarChart3, href: "/performance", category: "Navigation" },
  { id: "monitoring", label: "Monitoring Dashboard", icon: Activity, href: "/monitoring", category: "Navigation" },
  { id: "docs", label: "Documentation", icon: FileText, href: "/docs", category: "Navigation" },
  { id: "deploy", label: "Deploy", icon: Rocket, href: "/deploy", category: "Navigation" },
  { id: "keys", label: "Key Vault", icon: Key, href: "/keys", category: "Navigation" },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag, href: "/marketplace", category: "Navigation" },
  { id: "team", label: "Team Settings", icon: Users, href: "/team", category: "Navigation" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", category: "Navigation" },
  { id: "new-api", label: "Create New API", icon: Code2, href: "/builder", category: "Actions" },
  { id: "run-scan", label: "Run Security Scan", icon: Shield, href: "/security", category: "Actions" },
  { id: "run-perf", label: "Run Performance Test", icon: BarChart3, href: "/performance", category: "Actions" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) handleClose();
        else handleOpen();
      }
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleOpen, handleClose]);

  // Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        router.push(filtered[selectedIndex].href);
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Palette */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-cyber-white/10 bg-cyber-navy/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-cyber-white/5 px-4 py-3">
          <Search className="h-4 w-4 text-cyber-cyan" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-cyber-white placeholder:text-cyber-white/30 outline-none"
          />
          <kbd className="rounded border border-cyber-white/10 bg-cyber-white/5 px-1.5 py-0.5 text-[10px] font-mono text-cyber-white/30">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2 no-scrollbar">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-cyber-white/30">
              No results found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => {
                  router.push(cmd.href);
                  handleClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  i === selectedIndex
                    ? "bg-cyber-cyan/10 text-cyber-cyan"
                    : "text-cyber-white/60 hover:bg-cyber-white/5"
                }`}
              >
                <cmd.icon className="h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{cmd.label}</p>
                </div>
                <span className="text-[10px] text-cyber-white/20">
                  {cmd.category}
                </span>
                {i === selectedIndex && (
                  <CornerDownLeft className="h-3 w-3 text-cyber-cyan/50" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-cyber-white/5 px-4 py-2">
          <span className="flex items-center gap-1 text-[10px] text-cyber-white/20">
            <kbd className="rounded border border-cyber-white/10 bg-cyber-white/5 px-1 py-0.5 font-mono">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1 text-[10px] text-cyber-white/20">
            <kbd className="rounded border border-cyber-white/10 bg-cyber-white/5 px-1 py-0.5 font-mono">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1 text-[10px] text-cyber-white/20">
            <kbd className="rounded border border-cyber-white/10 bg-cyber-white/5 px-1 py-0.5 font-mono">esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
