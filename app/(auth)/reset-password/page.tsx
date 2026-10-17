"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="mx-auto h-14 w-14" style={{ color: "var(--success)" }} />
        <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>Password Updated</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>You can now log in with your new password.</p>
        <Link href="/login" className="catalyst-btn-primary inline-flex">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Set new password</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="catalyst-input !pl-10 !pr-10" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required className="catalyst-input !pl-10" />
          </div>
          {confirm && password !== confirm && <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>Passwords do not match</p>}
        </div>
        <button type="submit" disabled={loading} className="catalyst-btn-primary w-full !justify-center disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
        </button>
      </form>

      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
      </Link>
    </div>
  );
}
