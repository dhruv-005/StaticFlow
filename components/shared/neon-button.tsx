"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "cyan" | "purple" | "pink" | "green";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles = {
  cyan: "bg-cyber-cyan text-cyber-space shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] hover:bg-cyber-cyan/90",
  purple: "bg-cyber-purple text-white shadow-[0_0_15px_rgba(123,47,255,0.4)] hover:shadow-[0_0_25px_rgba(123,47,255,0.7)] hover:bg-cyber-purple/90",
  pink: "bg-cyber-pink text-white shadow-[0_0_15px_rgba(255,45,123,0.4)] hover:shadow-[0_0_25px_rgba(255,45,123,0.7)] hover:bg-cyber-pink/90",
  green: "bg-cyber-green text-cyber-space shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:shadow-[0_0_25px_rgba(0,255,136,0.7)] hover:bg-cyber-green/90",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-xs uppercase font-bold tracking-wider rounded-xl",
  lg: "px-7 py-3.5 text-sm uppercase font-black tracking-wider rounded-xl",
};

export function NeonButton({
  children,
  variant = "cyan",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}: NeonButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center font-mono font-bold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
