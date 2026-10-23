import { Code2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-hero-glow pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-2.5 mb-8 group">
        <div className="w-9 h-9 rounded-lg bg-crimson flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
          <Code2 size={20} className="text-white" />
        </div>
        <span className="font-display font-bold text-xl text-[var(--text-primary)] tracking-tight">
          Static<span className="text-crimson">Flow</span>
        </span>
      </Link>

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {children}
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-8 text-xs text-[var(--text-muted)]">
        &copy; {new Date().getFullYear()} StaticFlow. All rights reserved.
      </p>
    </div>
  );
}
