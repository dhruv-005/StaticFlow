import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="catalyst-section relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="catalyst-container text-center">
        <div className="mb-8 inline-flex items-center gap-2 catalyst-badge catalyst-badge-accent">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent-text)" }} />
          Now in Public Beta
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]" style={{ color: "var(--text)" }}>
          Enterprise APIs,{" "}
          <span style={{ color: "var(--text-muted)" }}>delivered intelligently.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-muted)" }}>
          Describe your API requirements in plain language. StaticFlow handles the
          generation, security auditing, performance testing, and multi-cloud deployment.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register" className="catalyst-btn-primary text-base">
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/demo" className="catalyst-btn-secondary text-base">
            <Play className="h-4 w-4" style={{ color: "var(--text-muted)" }} /> View Live Demo
          </Link>
        </div>

        <p className="mt-8 text-xs" style={{ color: "var(--text-muted)" }}>
          No credit card required · Free for individuals · SOC 2 compliant infrastructure
        </p>
      </div>
    </section>
  );
}
