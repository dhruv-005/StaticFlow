"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { OAuthButtons } from "./oauth-buttons";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate auth
    await new Promise((r) => setTimeout(r, 1500));

    if (email === "test@test.com" && password === "wrong") {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    // In production: signIn("credentials", { email, password, redirect: true, callbackUrl: "/overview" })
    window.location.href = "/overview";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-black text-cyber-white">
          Welcome <span className="neon-text">Back</span>
        </h2>
        <p className="mt-2 text-sm text-cyber-white/40">
          Log in to your StaticFlow account to continue building.
        </p>
      </div>

      {/* OAuth */}
      <OAuthButtons />

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-cyber-white/10" />
        <span className="text-xs text-cyber-white/30">or continue with email</span>
        <div className="h-px flex-1 bg-cyber-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-cyber-red/20 bg-cyber-red/5 px-4 py-3 text-sm text-cyber-red">
            {error}
          </div>
        )}

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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-cyber-white/60">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-cyber-cyan/70 hover:text-cyber-cyan transition-colors"
            >
              Forgot password?
            </Link>
          </div>
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
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-cyber-white/20 bg-cyber-white/5 accent-cyber-cyan"
          />
          <label
            htmlFor="remember"
            className="text-sm text-cyber-white/40 cursor-pointer"
          >
            Remember me for 30 days
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
              Signing in...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-cyber-white/30">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-cyber-cyan hover:underline"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
