"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-md border" style={{ borderColor: "var(--border)" }} />;
  }

  const Icon = resolvedTheme === "dark" ? Moon : Sun;
  const options: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
        style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--surface)" }}
        aria-label="Toggle theme"
      >
        <Icon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[140px] rounded-lg border p-1 shadow-lg"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          {options.map((opt) => {
            const OptIcon = opt.icon;
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => { setTheme(opt.value); setIsOpen(false); }}
                className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                style={{ color: "var(--text)", backgroundColor: active ? "var(--surface-muted)" : "transparent" }}
              >
                <span className="flex items-center gap-2">
                  <OptIcon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                  {opt.label}
                </span>
                {active && <Check className="h-3.5 w-3.5" style={{ color: "var(--accent-text)", backgroundColor: "var(--accent)", borderRadius: "50%", padding: "2px" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type Theme = "light" | "dark" | "system";
