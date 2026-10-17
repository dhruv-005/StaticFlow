"use client";

import { useState } from "react";
import { Send, CheckCircle2, Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 text-cyber-purple">
          <Mail className="h-5 w-5" />
          <span className="text-sm font-medium">Newsletter</span>
        </div>
        <h2 className="text-2xl font-black text-cyber-white sm:text-3xl">
          Stay in the <span className="neon-text-purple">Loop</span>
        </h2>
        <p className="mt-3 text-sm text-cyber-white/40">
          Get weekly updates on new features, API security tips, and AI
          engineering insights. No spam, unsubscribe anytime.
        </p>

        {submitted ? (
          <div className="mt-8 glass-card inline-flex items-center gap-3 px-6 py-4">
            <CheckCircle2 className="h-5 w-5 text-cyber-green" />
            <span className="text-sm text-cyber-white">
              You&apos;re in! Check your inbox for a welcome email.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              required
              className="w-full rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-4 py-3
                         text-sm text-cyber-white placeholder:text-cyber-white/30
                         outline-none transition-all focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/20
                         sm:w-80"
            />
            <button
              type="submit"
              disabled={loading}
              className="neon-button flex items-center justify-center gap-2 !px-6 !py-3 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyber-space border-t-transparent" />
              ) : (
                <>
                  Subscribe
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-cyber-white/20">
          Join 2,000+ developers. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
