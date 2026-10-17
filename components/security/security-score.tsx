"use client";

import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface SecurityScoreProps {
  score: number;
  grade: string;
}

export function SecurityScore({ score, grade }: SecurityScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const gradeColor =
    score >= 90
      ? "text-cyber-green"
      : score >= 70
        ? "text-cyber-yellow"
        : "text-cyber-red";

  const strokeColor =
    score >= 90
      ? "#00FF88"
      : score >= 70
        ? "#FFD700"
        : "#FF3366";

  const glowColor =
    score >= 90
      ? "rgba(0,255,136,0.3)"
      : score >= 70
        ? "rgba(255,215,0,0.3)"
        : "rgba(255,51,102,0.3)";

  const Icon = score >= 90 ? ShieldCheck : score >= 70 ? ShieldAlert : ShieldX;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-28 w-28">
        {/* Background Ring */}
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Score Ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black ${gradeColor}`}>{grade}</span>
          <span className="text-xs text-cyber-white/40 font-mono">{score}/100</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1">
        <Icon className={`h-3.5 w-3.5 ${gradeColor}`} />
        <span className={`text-xs font-semibold ${gradeColor}`}>Security Score</span>
      </div>
    </div>
  );
}
