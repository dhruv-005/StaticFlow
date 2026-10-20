"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/logs", label: "Audit Logs" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/overview");
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent)] animate-pulse" />
          <p className="text-sm text-[var(--muted)]">Verifying access…</p>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-6">
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[clamp(1.2rem,3vw,1.5rem)] font-bold text-[var(--text)]">
              Admin Panel
            </h1>
            <p className="text-xs text-[var(--muted)]">
              Platform management & oversight
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1 rounded-full w-fit">
          Administrator
        </span>
      </div>

      {/* Sub-nav */}
      <nav className="flex gap-1 overflow-x-auto no-scrollbar rounded-lg bg-[var(--surface)] border border-[var(--border)] p-1 -mx-1 px-1">
        {ADMIN_NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                shrink-0 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium
                transition-colors whitespace-nowrap
                ${
                  active
                    ? "bg-[var(--accent)] text-[var(--bg)]"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Content */}
      {children}
    </div>
  );
}
