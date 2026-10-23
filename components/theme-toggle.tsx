"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]" />;
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="inline-flex bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-0.5 gap-0.5">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            theme === value
              ? "bg-crimson text-white shadow-glow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
          aria-label={label}
          title={label}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
