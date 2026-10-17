"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--surface-muted)" }}>
          <CheckCircle2 className="h-7 w-7" style={{ color: "var(--success)" }} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>Check your inbox</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          We sent a reset link to <span className="font-semibold" style={{ color: "var(--text)" }}>{email}</span>.
        </p>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text)" }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Forgot password?</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Enter your email and we will send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className="catalyst-input !pl-10" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="catalyst-btn-primary w-full !justify-center disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
        </button>
      </form>

      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
      </Link>
    </div>
  );
}
