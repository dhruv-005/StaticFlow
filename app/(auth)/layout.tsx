import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — StaticFlow",
  description: "Sign in to your StaticFlow account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[var(--bg)] px-4 py-8 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow accent */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px]">{children}</div>
    </div>
  );
}
