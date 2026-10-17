"use client";

import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--surface-muted)" }}>
          <AlertTriangle className="h-8 w-8" style={{ color: "var(--danger)" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Something went wrong</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{error?.message || "An unexpected error occurred."}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="catalyst-btn-primary text-sm"><RefreshCw className="h-4 w-4" /> Try Again</button>
          <button onClick={() => router.push("/")} className="catalyst-btn-secondary text-sm"><ArrowLeft className="h-4 w-4" /> Home</button>
        </div>
      </div>
    </div>
  );
}
