import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="glass-card relative overflow-hidden p-12 text-center sm:p-16">
          {/* Background Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-cyber-cyan/[0.06] blur-[100px]" />
            <div className="absolute bottom-0 left-1/3 h-[200px] w-[400px] rounded-full bg-cyber-purple/[0.04] blur-[80px]" />
          </div>

          {/* Animated Border */}
          <div className="absolute inset-0 rounded-xl p-[1px]">
            <div className="h-full w-full rounded-xl bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20 animate-gradient-shift" />
          </div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 px-4 py-1.5 text-xs font-medium text-cyber-cyan">
              <Sparkles className="h-3 w-3" />
              Free Forever Plan Available
            </div>

            <h2 className="text-3xl font-black text-cyber-white sm:text-4xl md:text-5xl leading-tight">
              Ready to Build APIs{" "}
              <span className="gradient-text">10x Faster?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-cyber-white/50">
              Join thousands of developers who stopped writing boilerplate and
              started shipping products. Your first API is 15 minutes away.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="neon-button flex items-center gap-2 text-base"
              >
                Start Building Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="text-sm text-cyber-white/40 hover:text-cyber-cyan transition-colors underline underline-offset-4"
              >
                Try the live demo first
              </Link>
            </div>

            {/* Trust Row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-cyber-white/30">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-cyber-green" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-cyber-yellow" />
                Setup in 30 seconds
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyber-purple" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
