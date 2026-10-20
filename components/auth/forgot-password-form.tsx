"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  Loader2,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-cyber-green/20 bg-cyber-green/5">
          <CheckCircle2 className="h-8 w-8 text-cyber-green" />
        </div>
        <h2 className="text-xl font-bold text-cyber-white">Check Your Inbox</h2>
        <p className="mt-3 text-sm leading-relaxed text-cyber-white/40">
          We&apos;ve sent a password reset link to{" "}
          <span className="font-semibold text-cyber-cyan">{email}</span>.
          Click the link in the email to reset your password.
        </p>
        <p className="mt-4 text-xs text-cyber-white/30">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            onClick={() => setSent(false)}
            className="text-cyber-cyan hover:underline"
          >
            try again
          </button>
          .
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-cyber-white/40 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center lg:text-left">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 lg:mx-0">
          <KeyRound className="h-6 w-6 text-cyber-cyan" />
        </div>
        <h2 className="text-2xl font-black text-cyber-white">
          Forgot <span className="neon-text">Password?</span>
        </h2>
        <p className="mt-2 text-sm text-cyber-white/40">
          No worries. Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-cyber-white/60">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-white/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              required
              className="w-full rounded-lg border border-cyber-white/10 bg-cyber-white/5 py-3 pl-10 pr-4
                         text-sm text-cyber-white placeholder:text-cyber-white/20
                         outline-none transition-all focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="neon-button flex w-full items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-cyber-white/40 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
