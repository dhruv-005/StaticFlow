"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
  variant?: "cyan" | "purple" | "pink" | "green";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
  xl: "h-16 w-16 border-4",
};

const variantClasses = {
  cyan: "border-cyber-cyan/20 border-t-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]",
  purple: "border-cyber-purple/20 border-t-cyber-purple shadow-[0_0_15px_rgba(123,47,255,0.4)]",
  pink: "border-cyber-pink/20 border-t-cyber-pink shadow-[0_0_15px_rgba(255,45,123,0.4)]",
  green: "border-cyber-green/20 border-t-cyber-green shadow-[0_0_15px_rgba(0,255,136,0.4)]",
};

export function LoadingSpinner({
  size = "md",
  variant = "cyan",
  label,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        {/* Outer Rotating Glow Ring */}
        <div
          className={cn(
            "animate-spin rounded-full transition-all",
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        {/* Inner Pulse Core */}
        <div
          className={cn(
            "absolute inset-0 m-auto rounded-full animate-ping opacity-30",
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-3 w-3",
            size === "lg" && "h-4 w-4",
            size === "xl" && "h-6 w-6",
            variant === "cyan" && "bg-cyber-cyan",
            variant === "purple" && "bg-cyber-purple",
            variant === "pink" && "bg-cyber-pink",
            variant === "green" && "bg-cyber-green"
          )}
        />
      </div>
      {label && (
        <span className="text-xs font-mono text-cyber-white/60 tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
