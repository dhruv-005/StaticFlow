"use client";

import { LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-card flex flex-col items-center justify-center p-8 text-center sm:p-12",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-base font-bold text-cyber-white sm:text-lg">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-cyber-white/40 sm:text-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="neon-button mt-6 text-xs font-bold uppercase tracking-wider"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
