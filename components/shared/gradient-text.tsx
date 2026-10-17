import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  gradient?: "cyan-purple" | "purple-pink" | "cyan-green" | "neon";
  className?: string;
}

const gradientClasses = {
  "cyan-purple": "from-cyber-cyan via-[#4D7CFF] to-cyber-purple",
  "purple-pink": "from-cyber-purple via-[#BD2FFF] to-cyber-pink",
  "cyan-green": "from-cyber-cyan to-cyber-green",
  neon: "from-cyber-cyan via-cyber-purple to-cyber-pink",
};

export function GradientText({
  children,
  gradient = "neon",
  className,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent font-black tracking-tight",
        gradientClasses[gradient],
        className
      )}
    >
      {children}
    </span>
  );
}
