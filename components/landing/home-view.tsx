"use client";

import Link from "next/link";
import { ArrowRight, Code2, Shield, Rocket, Activity, Zap, Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function HomeView() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A1A] text-white">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 text-center overflow-hidden">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-bold text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered API Engine
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl leading-tight">
            Build APIs in <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Minutes</span>, Not Weeks
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-white/50 leading-relaxed">
            Describe your API in plain English. StaticFlow generates production code, runs OWASP security audits, benchmarks latency, and deploys to the cloud.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/builder"
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-black hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              Start Building Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              <Play className="h-4 w-4 text-cyan-400" />
              Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-6 py-16 border-t border-white/5 bg-[#111133]/20">
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
            <Code2 className="h-6 w-6 text-cyan-400" />
            <h3 className="font-bold text-base">Prompt-to-Code</h3>
            <p className="text-xs text-white/50 leading-relaxed">Full Express, FastAPI, and Gin scaffolding generated from requirements.</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
            <Shield className="h-6 w-6 text-green-400" />
            <h3 className="font-bold text-base">OWASP Top 10 Scans</h3>
            <p className="text-xs text-white/50 leading-relaxed">Automated vulnerability tests, SQL injection checks, and auto-fixes.</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
            <Activity className="h-6 w-6 text-purple-400" />
            <h3 className="font-bold text-base">Performance Lab</h3>
            <p className="text-xs text-white/50 leading-relaxed">Load test up to 10k virtual users with percentile latency graphs.</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
            <Rocket className="h-6 w-6 text-pink-400" />
            <h3 className="font-bold text-base">1-Click Cloud Deploy</h3>
            <p className="text-xs text-white/50 leading-relaxed">Direct deployments to Vercel, Render, and Fly.io with custom domains.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
