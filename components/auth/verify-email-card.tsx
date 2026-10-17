"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MailCheck,
  Mail,
  Loader2,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function VerifyEmailCard() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (countdown > 0 && resent) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      setResent(false);
    }
  }, [countdown, resent]);

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResending(false);
    setResent(true);
    setCountdown(60);
  };

  if (verified) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyber-green/30 bg-cyber-green/5">
          <CheckCircle2 className="h-10 w-10 text-cyber-green" />
        </div>
        <h2 className="text-2xl font-black text-cyber-white">
          Email <span className="neon-text">Verified!</span>
        </h2>
        <p className="mt-3 text-sm text-cyber-white/40">
          Your account is now active. Welcome to StaticFlow!
        </p>
        <Link
          href="/overview"
          className="neon-button mt-8 inline-flex items-center gap-2 text-sm"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyber-cyan/20 bg-cyber-cyan/5 animate-pulse-glow">
        <MailCheck className="h-10 w-10 text-cyber-cyan" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-black text-cyber-white">
        Verify Your <span className="neon-text">Email</span>
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-cyber-white/40">
        We&apos;ve sent a verification link to your email address. Click the
        link to activate your account and start building APIs.
      </p>

      {/* Email Visual */}
      <div className="mx-auto mt-8 max-w-xs glass-card p-6">
        <Mail className="mx-auto mb-3 h-8 w-8 text-cyber-cyan/40" />
        <div className="space-y-2">
          <div className="h-2 w-3/4 rounded bg-cyber-white/10 mx-auto" />
          <div className="h-2 w-full rounded bg-cyber-white/10" />
          <div className="h-2 w-5/6 rounded bg-cyber-white/10" />
          <div className="mt-3 mx-auto w-fit rounded bg-cyber-cyan/20 px-4 py-1.5">
            <div className="h-2 w-16 rounded bg-cyber-cyan/40" />
          </div>
        </div>
      </div>

      {/* Resend */}
      <div className="mt-8">
        {resent ? (
          <p className="text-sm text-cyber-green">
            ✅ New verification email sent!{" "}
            {countdown > 0 && (
              <span className="text-cyber-white/30">
                Resend in {countdown}s
              </span>
            )}
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-2 rounded-lg border border-cyber-white/10
                       bg-cyber-white/5 px-5 py-2.5 text-sm font-medium text-cyber-white/60
                       hover:bg-cyber-white/10 hover:text-cyber-white transition-all
                       disabled:opacity-50"
          >
            {resending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Resend Verification Email
          </button>
        )}
      </div>

      {/* Help */}
      <p className="mt-6 text-xs text-cyber-white/20">
        Didn&apos;t receive the email? Check your spam folder or contact{" "}
        <Link href="/contact" className="text-cyber-cyan/50 hover:underline">
          support
        </Link>
        .
      </p>
    </div>
  );
}
