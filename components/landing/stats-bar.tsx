"use client";

import { useEffect, useRef, useState } from "react";

interface PlatformStats {
  totalProjects: number;
  totalUsers: number;
  totalApiCalls: number;
  totalKeys: number;
  uptime: number;
}

function AnimatedNumber({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <div ref={ref} className="text-3xl font-black sm:text-4xl">
      <span className="gradient-text">{display}</span>
      <span className="text-cyber-white/60">{suffix}</span>
    </div>
  );
}

export function StatsBar() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const items = [
    {
      value: stats?.totalApiCalls ?? 0,
      suffix: "+",
      label: "API Calls Served",
      decimals: 0,
    },
    {
      value: stats?.uptime ?? 99.9,
      suffix: "%",
      label: "Platform Uptime",
      decimals: 1,
    },
    {
      value: stats?.totalProjects ?? 0,
      suffix: "+",
      label: "APIs Generated",
      decimals: 0,
    },
    {
      value: stats?.totalUsers ?? 0,
      suffix: "+",
      label: "Developers",
      decimals: 0,
    },
  ];

  return (
    <section className="relative border-y border-cyber-white/5 bg-cyber-navy/30 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        {items.map((stat) => (
          <div key={stat.label} className="text-center">
            <AnimatedNumber target={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
            <p className="mt-2 text-sm text-cyber-white/40">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
