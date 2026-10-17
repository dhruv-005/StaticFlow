"use client";

import {
  Code2,
  Shield,
  Activity,
  Rocket,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

type TrendType = "up" | "down" | "neutral";

interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: TrendType;
  icon: any;
  color: string;
  bg: string;
  border: string;
}

const stats: StatItem[] = [
  {
    label: "Total APIs",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Code2,
    color: "text-cyber-cyan",
    bg: "bg-cyber-cyan/5",
    border: "border-cyber-cyan/10",
  },
  {
    label: "Security Score",
    value: "A+",
    change: "95/100",
    trend: "up",
    icon: Shield,
    color: "text-cyber-green",
    bg: "bg-cyber-green/5",
    border: "border-cyber-green/10",
  },
  {
    label: "Avg Response",
    value: "42ms",
    change: "-8ms",
    trend: "up",
    icon: Activity,
    color: "text-cyber-purple",
    bg: "bg-cyber-purple/5",
    border: "border-cyber-purple/10",
  },
  {
    label: "Deployments",
    value: "28",
    change: "0",
    trend: "neutral",
    icon: Rocket,
    color: "text-cyber-pink",
    bg: "bg-cyber-pink/5",
    border: "border-cyber-pink/10",
  },
];

function TrendIcon({ trend }: { trend: TrendType }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-cyber-green" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-cyber-red" />;
  return <Minus className="h-3 w-3 text-cyber-white/30" />;
}

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`glass-card p-5 transition-all duration-300 hover:scale-[1.02] ${stat.border}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-cyber-white/40 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-black ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} border ${stat.border}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <TrendIcon trend={stat.trend} />
            <span
              className={`text-xs font-medium ${
                stat.trend === "up"
                  ? "text-cyber-green"
                  : stat.trend === "down"
                  ? "text-cyber-red"
                  : "text-cyber-white/30"
              }`}
            >
              {stat.change}
            </span>
            <span className="text-xs text-cyber-white/20">vs last week</span>
          </div>
        </div>
      ))}
    </div>
  );
}
