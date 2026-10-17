"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="text-center space-y-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Redirecting to login...</p>
    </div>
  );
}
