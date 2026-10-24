"use client";
import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      window.location.href = "/app/dashboard";
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-noir-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-crimson/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-noir-400 hover:text-white mb-8 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to home</Link>
        <div className="card-static p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-crimson flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-2xl font-display font-bold">Welcome back</h1><p className="text-noir-400 text-sm">Log in to your StaticFlow account</p></div>
          </div>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1.5 text-noir-300">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-500" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input pl-10" placeholder="you@example.com" /></div></div>
            <div><label className="block text-sm font-medium mb-1.5 text-noir-300">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-500" /><input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="input pl-10 pr-10" placeholder="••••••••" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-500 hover:text-white">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
            <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-noir-400"><input type="checkbox" className="rounded border-noir-700 bg-noir-800 text-crimson focus:ring-crimson" /> Remember me</label><Link href="/forgot-password" className="text-crimson hover:text-crimson-hover transition-colors">Forgot password?</Link></div>
            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">{loading ? "Logging in..." : "Log In"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-noir-400">Don&apos;t have an account? <Link href="/signup" className="text-crimson hover:text-crimson-hover font-medium">Sign up free</Link></p>
        </div>
      </div>
    </div>
  );
}
