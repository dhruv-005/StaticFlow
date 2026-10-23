"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send reset link");
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-8 shadow-card">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          Reset password
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-green-500" />
          </div>
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            Check your email
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            We sent a password reset link to{" "}
            <span className="font-medium text-[var(--text-primary)]">{email}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              className="text-crimson hover:underline font-medium"
            >
              try again
            </button>
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>Send Reset Link <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-crimson transition-colors font-medium"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
