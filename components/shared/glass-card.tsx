import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: "cyan" | "purple" | "pink" | "green" | "none";
  hoverable?: boolean;
}

const glowStyles = {
  cyan: "hover:border-cyber-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]",
  purple: "hover:border-cyber-purple/40 hover:shadow-[0_0_25px_rgba(123,47,255,0.15)]",
  pink: "hover:border-cyber-pink/40 hover:shadow-[0_0_25px_rgba(255,45,123,0.15)]",
  green: "hover:border-cyber-green/40 hover:shadow-[0_0_25px_rgba(0,255,136,0.15)]",
  none: "",
};

export function GlassCard({
  children,
  glow = "cyan",
  hoverable = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-cyber-white/10 bg-cyber-navy/50 p-6 backdrop-blur-xl transition-all duration-300",
        hoverable && "hover:-translate-y-0.5",
        glow !== "none" && glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
