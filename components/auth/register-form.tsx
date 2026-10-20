"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { OAuthButtons } from "./oauth-buttons";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Upper & lowercase letters", pass: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "At least one number", pass: /\d/.test(password) },
    { label: "At least one symbol", pass: /[^a-zA-Z0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (strength < 2) {
      setError("Please create a stronger password.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    // In production: redirect to /verify-email
    window.location.href = "/verify-email";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-black text-cyber-white">
          Create Your <span className="gradient-text">Account</span>
        </h2>
        <p className="mt-2 text-sm text-cyber-white/40">
          Start building APIs in minutes. Free forever, no credit card required.
        </p>
      </div>

      {/* OAuth */}
      <OAuthButtons />

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-cyber-white/10" />
        <span className="text-xs text-cyber-white/30">or sign up with email</span>
        <div className="h-px flex-1 bg-cyber-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-cyber-red/20 bg-cyber-red/5 px-4 py-3 text-sm text-cyber-red">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-cyber-white/60">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-white/30" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full rounded-lg border border-cyber-white/10 bg-cyber-white/5 py-3 pl-10 pr-4
                         text-sm text-cyber-white placeholder:text-cyber-white/20
                         outline-none transition-all focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/20"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-cyber-white/60">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-white/30" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-cyber-white/10 bg-cyber-white/5 py-3 pl-10 pr-10
                         text-sm text-cyber-white placeholder:text-cyber-white/20
                         outline-none transition-all focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-white/30 hover:text-cyber-white/60 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Strength */}
          {password && (
            <div className="mt-3 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength
                        ? strength >= 3
                          ? "bg-cyber-green"
                          : "bg-cyber-yellow"
                        : "bg-cyber-white/10"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {checks.map((check) => (
                  <div
                    key={check.label}
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle2
                      className={`h-3 w-3 ${
                        check.pass ? "text-cyber-green" : "text-cyber-white/15"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        check.pass
                          ? "text-cyber-green/70"
                          : "text-cyber-white/25"
                      }`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-cyber-white/20 bg-cyber-white/5 accent-cyber-cyan"
          />
          <label
            htmlFor="terms"
            className="text-xs leading-relaxed text-cyber-white/40 cursor-pointer"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-cyber-cyan hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-cyber-cyan hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="neon-button flex w-full items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Create Free Account
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-cyber-white/30">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-cyber-cyan hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
