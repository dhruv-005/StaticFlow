"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "APIs Generated" },
  { value: 99.9, suffix: "%", label: "Security Score" },
  { value: 50, suffix: "+", label: "Frameworks" },
  { value: 15, suffix: " min", label: "Avg Deploy Time" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
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
              setCount(Math.floor(current * 10) / 10);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = Number.isInteger(target) ? Math.floor(count) : count.toFixed(1);

  return (
    <div ref={ref} className="text-3xl font-black sm:text-4xl">
      <span className="gradient-text">{display}</span>
      <span className="text-cyber-white/60">{suffix}</span>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="relative border-y border-cyber-white/5 bg-cyber-navy/30 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <AnimatedNumber target={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-sm text-cyber-white/40">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
