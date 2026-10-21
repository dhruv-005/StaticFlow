"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function LoadingScreen() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-500 animate-pulse" />
        <p className="text-sm text-[var(--muted)]">Verifying admin access…</p>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?callbackUrl=/admin");
      return;
    }
    if (user.role !== "ADMIN") {
      setDenied(true);
    }
  }, [user, loading, router]);

  if (loading) return <LoadingScreen />;

  if (denied) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg)] p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--danger, #ef4444)" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[var(--text)]">Access Denied</h1>
          <p className="text-sm text-[var(--muted)]">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => router.push("/overview")}
            className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") return <LoadingScreen />;

  return <>{children}</>;
}
